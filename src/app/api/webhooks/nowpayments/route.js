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

  const { payment_status, payment_id, order_id } = payload;
  
  if (!payment_id || !order_id || typeof order_id !== 'string') {
    return NextResponse.json({ error: 'Incomplete payload' }, { status: 400 });
  }

  // Validate order_id format (expected: userId_uuid)
  if (!order_id.includes('_')) {
    return NextResponse.json({ error: 'Malformed order identifier' }, { status: 400 });
  }

  const userId = order_id.split('_')[0];

  try {
    // 2. Update payment record status
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin
      .from('crypto_payments')
      .update({ 
        payment_status,
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', String(payment_id));

    // 3. Handle finished payment (Subscription Update)
    if (payment_status === 'finished' || payment_status === 'partially_paid') {
      const { data: payment } = await supabaseAdmin
        .from('crypto_payments')
        .select('plan_id')
        .eq('payment_id', String(payment_id))
        .single();

      if (!payment) throw new Error('Payment record not found');

      const planId = payment.plan_id;
      let periodEnd = null;

      // Calculate period end for monthly plan
      if (planId === 'pro') {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        periodEnd = date.toISOString();
      } else if (planId === 'lifetime') {
        periodEnd = null; // Infinite access
      }

      // Atomically upgrade subscription
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          current_period_end: periodEnd,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (subError) throw subError;
      
      console.log(`Successfully upgraded user ${userId} to ${planId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('NOWPayments Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
