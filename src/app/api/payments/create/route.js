import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { nowPaymentsService } from '@/lib/payments/nowpayments';

export async function POST(req) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Implement rate limiting for payment initiation to prevent spam.
  // Suggested: 5 requests per 10 minutes per user using a sliding window or bucket.

  try {
    const { planId } = await req.json();
    
    // Define prices
    const prices = {
      'pro': 20,
      'lifetime': 50
    };

    if (!prices[planId]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Construct callback URL with fallback
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    // If missing or on localhost, try to get from headers
    if (!baseUrl || baseUrl.includes('localhost')) {
      const host = req.headers.get('host');
      const protocol = req.headers.get('x-forwarded-proto') || 'https';
      baseUrl = `${protocol}://${host}`;
    }

    // Ensure no trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');

    const payload = {
      price_amount: prices[planId],
      price_currency: 'usd',
      pay_currency: 'usdtarb', // USDT on Arbitrum (High speed, Low fee)
      ipn_callback_url: `${baseUrl}/api/webhooks/nowpayments`,
      order_id: `${user.id}_${Date.now()}`,
      order_description: `SMC Journal ${planId.replace('_', ' ').toUpperCase()} Plan`
    };

    console.log('--- Payment Request Started ---');
    console.log('Plan:', planId);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const payment = await nowPaymentsService.createPayment(payload);
    
    console.log('NOWPayments Response:', JSON.stringify(payment, null, 2));

    if (payment.status === false || payment.error || !payment.payment_id) {
       const msg = payment.message || payment.error || 'NOWPayments API Error';
       console.error('Payment Error Details:', payment);
       return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Save payment record in DB
    const { error: dbError } = await supabase.from('crypto_payments').insert({
      user_id: user.id,
      payment_id: String(payment.payment_id),
      order_id: payment.order_id,
      price_amount: prices[planId],
      price_currency: 'usd',
      payment_status: payment.payment_status,
      pay_address: payment.pay_address,
      pay_amount: payment.pay_amount,
      pay_currency: payment.pay_currency,
      plan_id: planId
    });

    if (dbError) throw dbError;

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
