import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { nowPaymentsService } from '@/lib/payments/nowpayments';

export async function POST(req) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { planId } = await req.json();
    
    // Define prices
    const prices = {
      'pro_monthly': 10,
      'lifetime': 50
    };

    if (!prices[planId]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const payload = {
      price_amount: prices[planId],
      price_currency: 'usd',
      pay_currency: 'btc', // You can make this dynamic later
      ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/nowpayments`,
      order_id: `${user.id}_${Date.now()}`,
      order_description: `EdgeLedger ${planId.replace('_', ' ').toUpperCase()} Plan`,
      case: planId // Custom field to track plan in payload
    };

    const payment = await nowPaymentsService.createPayment(payload);

    if (payment.error || !payment.payment_id) {
       throw new Error(payment.message || 'NOWPayments API Error');
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
      plan_id: planId
    });

    if (dbError) throw dbError;

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
