import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { nowPaymentsService } from '@/lib/payments/nowpayments';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase admin credentials missing');
  }
  
  return createClient(url, key);
}

export async function POST(req) {
  const headerStore = await headers();
  const signature = headerStore.get('x-nowpayments-sig');
  const payload = await req.json();

  // 1. Verify IPN signature
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!ipnSecret || !signature) {
    console.error('NOWPayments Security: Missing secret or signature');
    return NextResponse.json({ error: 'Security credentials missing' }, { status: 403 });
  }

  const isValid = nowPaymentsService.verifySignature(payload, signature, ipnSecret);
  if (!isValid) {
    console.warn('Invalid NOWPayments IPN Signature detected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { payment_status, payment_id, order_id, invoice_id } = payload;
  
  if (!payment_id || !order_id || typeof order_id !== 'string') {
    return NextResponse.json({ error: 'Incomplete payload' }, { status: 400 });
  }

  // Validate order_id format (expected: userId_uuid OR founding-member-userId-uuid)
  if (!order_id.includes('_') && !order_id.startsWith('founding-member-')) {
    return NextResponse.json({ error: 'Malformed order identifier' }, { status: 400 });
  }

  const isFoundingMember = order_id.startsWith('founding-member-');
  const userId = isFoundingMember ? order_id.split('-')[2] : order_id.split('_')[0];

  console.log(`[WEBHOOK_RECEIVED] payment_id=${payment_id} invoice_id=${invoice_id || 'N/A'} status=${payment_status} order_id=${order_id}`);

  try {
    // 2. Fetch current payment status to ensure idempotency
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: currentPayment } = await supabaseAdmin
      .from('crypto_payments')
      .select('payment_status, plan_id, price_amount, coupon_code')
      .eq('payment_id', String(payment_id))
      .single();

    // If payment is already marked as finished, don't re-process logic
    if (currentPayment?.payment_status === 'finished') {
       console.log(`[WEBHOOK_IDEMPOTENCY] payment_id=${payment_id} already finished. Skipping.`);
       return NextResponse.json({ received: true, message: 'Already processed' });
    }

    // 3. Update payment record status
    await supabaseAdmin
      .from('crypto_payments')
      .update({ 
        payment_id: String(payment_id), 
        payment_status,
        updated_at: new Date().toISOString()
      })
      .or(`payment_id.eq.${payment_id}${invoice_id ? `,payment_id.eq.${invoice_id}` : ''},order_id.eq.${order_id}`);

    // 4. Handle finished payment (Subscription Update)
    if (payment_status === 'finished' || payment_status === 'partially_paid') {
      // Re-fetch or use currentPayment if it was missing before insertion
      const planId = currentPayment?.plan_id || payload.price_amount > 70 ? 'lifetime' : (payload.price_amount > 40 ? '6_month' : 'pro');
      const paidAmount = currentPayment?.price_amount || payload.price_amount || 0;
      let periodEnd = null;

      // Calculate period end based on plan
      if (planId === 'pro') {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        periodEnd = date.toISOString();
      } else if (planId === '6_month') {
        // Check if user already has an active subscription to extend
        const { data: existingSub } = await supabaseAdmin
          .from('subscriptions')
          .select('current_period_end')
          .eq('user_id', userId)
          .single();

        const now = new Date();
        let baseDate = now;

        // If existing subscription is still active, extend from its end date
        if (existingSub?.current_period_end) {
          const existingEnd = new Date(existingSub.current_period_end);
          if (existingEnd > now) {
            baseDate = existingEnd;
          }
        }

        baseDate.setDate(baseDate.getDate() + 180);
        periodEnd = baseDate.toISOString();
      } else if (planId === 'lifetime' || planId === 'lifetime_legacy') {
        periodEnd = null; // Perpetual access
      }

      // Atomically upgrade subscription
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_id: (planId === 'lifetime' || planId === 'lifetime_legacy') ? 'lifetime' : planId,
          status: 'active',
          current_period_end: periodEnd,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (subError) throw subError;

      // Handle specific upgrades for Founding Member Tier
      if (isFoundingMember || planId === 'lifetime') {
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            is_pro: true,
            plan_type: 'pro_lifetime',
            is_founding_member: true,
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: null,
            founding_member_claimed_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (profileError) console.error('[Webhook] Failed to update profile', profileError);

        if (isFoundingMember) {
           // Increment slots table
           const { data: spotsData } = await supabaseAdmin
             .from('founding_member_spots')
             .select('claimed_spots, total_spots')
             .single();
             
           if (spotsData) {
              const newClaimed = spotsData.claimed_spots + 1;
              await supabaseAdmin
                .from('founding_member_spots')
                .update({ 
                  claimed_spots: newClaimed,
                  is_active: newClaimed < spotsData.total_spots
                })
                .neq('claimed_spots', null); // Update the single row globally
           }
        }
      }

      // ============================================================
      // 5. AFFILIATE COMMISSION ATTRIBUTION
      // ============================================================
      try {
        // Check if the paying user was referred by an affiliate
        const { data: payerProfile } = await supabaseAdmin
          .from('profiles')
          .select('referred_by')
          .eq('id', userId)
          .single();

        if (payerProfile?.referred_by) {
          // Get the affiliate's commission rate
          const { data: affiliate } = await supabaseAdmin
            .from('affiliates')
            .select('id, commission_rate, total_earnings_usd')
            .eq('id', payerProfile.referred_by)
            .eq('status', 'active')
            .single();

          if (affiliate && paidAmount > 0) {
            const commissionRate = affiliate.commission_rate || 0.10; // Default 10%
            const commissionEarned = parseFloat((paidAmount * commissionRate).toFixed(2));

            // Update the referral record with commission info
            const { error: refUpdateError } = await supabaseAdmin
              .from('affiliate_referrals')
              .update({
                plan_purchased: planId,
                commission_earned: commissionEarned,
                commission_paid: false,
              })
              .eq('affiliate_id', affiliate.id)
              .eq('user_id', userId);

            if (refUpdateError) {
              // If no existing record, create one (edge case: user paid before referral was tracked)
              console.warn('[Commission] No existing referral record, creating one:', refUpdateError.message);
              await supabaseAdmin
                .from('affiliate_referrals')
                .insert({
                  affiliate_id: affiliate.id,
                  user_id: userId,
                  signup_date: new Date().toISOString(),
                  plan_purchased: planId,
                  commission_earned: commissionEarned,
                  commission_paid: false,
                });
            }

            // Increment affiliate total earnings
            await supabaseAdmin
              .from('affiliates')
              .update({
                total_earnings_usd: parseFloat(((affiliate.total_earnings_usd || 0) + commissionEarned).toFixed(2))
              })
              .eq('id', affiliate.id);

            console.log(`[COMMISSION_ATTRIBUTED] affiliate_id=${affiliate.id} user_id=${userId} amount=$${commissionEarned} plan=${planId}`);
          }
        }
      } catch (commissionError) {
        // Commission attribution failure should NOT block the payment processing
        console.error('[Commission Attribution] Non-blocking error:', commissionError);
      }

      console.log(`[SUBSCRIPTION_ASSIGNED] user_id=${userId} plan=${planId} period_end=${periodEnd || 'perpetual'}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('NOWPayments Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
