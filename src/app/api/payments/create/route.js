import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { nowPaymentsService } from '@/lib/payments/nowpayments';
import { rateLimit } from '@/lib/rateLimit';
import { ENV } from '@/config/env';

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

    // Apply Coupon Discount
    let finalPrice = prices[planId];
    const isPromo = coupon?.toUpperCase() === 'SMC2026';
    if (isPromo) {
      finalPrice = finalPrice * 0.8; // 20% off
    }

    const payload = {
      price_amount: finalPrice,
      price_currency: 'usd',
      ipn_callback_url: `${baseUrl}/api/webhooks/nowpayments`,
      order_id: `${user.id}_${Date.now()}`,
      order_description: `SMC Journal ${planId.replace('_', ' ').toUpperCase()} Plan${isPromo ? ' (PROMO: SMC2026)' : ''}`,
      success_url: `${baseUrl}/dashboard?payment=success`,
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
      price_amount: prices[planId],
      price_currency: 'usd',
      payment_status: 'created',
      plan_id: planId,
      billing_details: billingDetails,
      coupon_code: isPromo ? coupon : null
    });

    if (dbError) throw dbError;

    console.log(`[INVOICE_CREATED] user_id=${user.id} email=${user.email} plan=${planId} invoice_id=${invoice.id} amount=${finalPrice}`);

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
