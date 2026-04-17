import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { nowPaymentsService } from '@/lib/payments/nowpayments';
import { rateLimit } from '@/lib/rateLimit';
import { ENV } from '@/config/env';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(req) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting for payment initiation (3 requests per minute per user)
  const limit = rateLimit(`payment_${user.id}`, 3, 60000);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many payment requests. Please wait a minute before trying again.' },
      { status: 429 }
    );
  }

  try {
    const { planId, billingDetails, coupon } = await req.json();
    
    // Define prices
    const prices = {
      'pro': 20,
      '6_month': 50,
      'lifetime': 79
    };

    if (!prices[planId]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Construct callback URL from validated environment variable
    const baseUrl = ENV.SITE_URL.replace(/\/$/, '');

    // ============================================================
    // COUPON & AFFILIATE DISCOUNT LOGIC
    // ============================================================
    let finalPrice = prices[planId];
    let appliedCoupon = null;
    let affiliateId = null;

    if (coupon && typeof coupon === 'string' && coupon.trim().length > 0) {
      const normalizedCoupon = coupon.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, '').slice(0, 32);

      // 1. Check for hardcoded promo codes first
      if (normalizedCoupon === 'SMC2026') {
        finalPrice = parseFloat((finalPrice * 0.8).toFixed(2)); // 20% off
        appliedCoupon = normalizedCoupon;
      } else {
        // 2. Check if it's an affiliate coupon code
        const adminSb = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data: affiliate } = await adminSb
          .from('affiliates')
          .select('id, coupon_code, discount_rate, commission_rate')
          .eq('coupon_code', normalizedCoupon)
          .eq('status', 'active')
          .single();

        if (affiliate) {
          const discountRate = affiliate.discount_rate || 0.10; // Default 10% discount
          finalPrice = parseFloat((finalPrice * (1 - discountRate)).toFixed(2));
          appliedCoupon = normalizedCoupon;
          affiliateId = affiliate.id;

          // Link the user to this affiliate if not already linked
          const { data: profile } = await adminSb
            .from('profiles')
            .select('referred_by')
            .eq('id', user.id)
            .single();

          if (profile && !profile.referred_by) {
            await adminSb
              .from('profiles')
              .update({ referred_by: affiliate.id })
              .eq('id', user.id);

            // Create referral record if doesn't exist
            const { data: existingRef } = await adminSb
              .from('affiliate_referrals')
              .select('id')
              .eq('affiliate_id', affiliate.id)
              .eq('user_id', user.id)
              .limit(1);

            if (!existingRef || existingRef.length === 0) {
              await adminSb
                .from('affiliate_referrals')
                .insert({
                  affiliate_id: affiliate.id,
                  user_id: user.id,
                  signup_date: new Date().toISOString(),
                  plan_purchased: null,
                  commission_earned: 0,
                  commission_paid: false,
                });
            }
          }
        }
        // If coupon doesn't match anything, silently ignore (no discount applied)
      }
    }

    // Ensure price never goes below $1
    finalPrice = Math.max(1, finalPrice);

    const payload = {
      price_amount: finalPrice,
      price_currency: 'usd',
      ipn_callback_url: `${baseUrl}/api/webhooks/nowpayments`,
      order_id: `${user.id}_${Date.now()}`,
      order_description: `SMC Journal ${planId.replace('_', ' ').toUpperCase()} Plan${appliedCoupon ? ` (CODE: ${appliedCoupon})` : ''}`,
      success_url: `${baseUrl}/payment-success?plan=${planId}`,
      cancel_url: `${baseUrl}/billing?cancelled=true`
    };

    const invoice = await nowPaymentsService.createInvoice(payload);

    if (invoice.status === false || invoice.error || !invoice.id) {
       const msg = invoice.message || invoice.error || 'NOWPayments API Error';
       console.error('Invoice Error Details:', invoice);
       return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Save payment record in DB
    const { error: dbError } = await supabase.from('crypto_payments').insert({
      user_id: user.id,
      payment_id: String(invoice.id),
      order_id: invoice.order_id,
      price_amount: finalPrice,
      price_currency: 'usd',
      payment_status: 'created',
      plan_id: planId,
      billing_details: billingDetails,
      coupon_code: appliedCoupon,
    });

    if (dbError) throw dbError;

    console.log(`[INVOICE_CREATED] user_id=${user.id} email=${user.email} plan=${planId} invoice_id=${invoice.id} amount=${finalPrice}${appliedCoupon ? ` coupon=${appliedCoupon}` : ''}${affiliateId ? ` affiliate=${affiliateId}` : ''}`);

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
