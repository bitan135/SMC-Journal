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

  const { billing } = await req.json();

  // Rate limiting (3 requests per minute per user)
  const limit = rateLimit(`payment_fm_${user.id}`, 3, 60000);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many payment requests. Please wait a minute before trying again.' },
      { status: 429 }
    );
  }

  try {
    // 1. Check spots availability
    const { data: spotRecord, error: spotError } = await supabase
      .from('founding_member_spots')
      .select('total_spots, claimed_spots, is_active')
      .limit(1)
      .single();

    if (spotError && spotError.code !== 'PGRST116') {
      console.error('[Founding Member] Spot check failed:', spotError);
      return NextResponse.json({ error: 'Failed to verify spot availability.' }, { status: 500 });
    }

    if (!spotRecord || !spotRecord.is_active || spotRecord.claimed_spots >= spotRecord.total_spots) {
      return NextResponse.json({ error: 'All Founding Member spots have been claimed.' }, { status: 400 });
    }

    // 2. Prevent duplicate purchases
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_type, is_pro')
      .eq('id', user.id)
      .single();

    if (profile?.plan_type === 'pro_lifetime' || profile?.plan_type === 'lifetime' || profile?.plan_type === 'lifetime_legacy') {
      return NextResponse.json({ error: 'You are already a Lifetime Pro Member.' }, { status: 400 });
    }

    // 3. Initiate NOWPayments Invoice
    const baseUrl = ENV.SITE_URL.replace(/\/$/, '');
    
    // As instructed by architectural design: 'founding-member-{user_id}-{timestamp}'
    const orderId = `founding-member-${user.id}-${Date.now()}`;
    const payload = {
      price_amount: 79,
      price_currency: 'usd',
      ipn_callback_url: `${baseUrl}/api/webhooks/nowpayments`,
      order_id: orderId,
      order_description: "SMC Journal Founding Member Lifetime Plan",
      success_url: `${baseUrl}/payment-success?plan=founding-member`,
      cancel_url: `${baseUrl}/checkout/founding-member?cancelled=true`
    };

    const invoice = await nowPaymentsService.createInvoice(payload);

    if (invoice.status === false || invoice.error || !invoice.id) {
       const msg = invoice.message || invoice.error || 'NOWPayments API Error';
       console.error('[Founding Member] Invoice Error Details:', invoice);
       return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Save payment record in DB referencing this order
    // Note: We store the invoice ID in the payment_id column for initial tracking
    const { error: dbError } = await supabase.from('crypto_payments').insert({
      user_id: user.id,
      payment_id: String(invoice.id),
      order_id: invoice.order_id,
      price_amount: 79,
      price_currency: 'usd',
      payment_status: 'created',
      plan_id: 'lifetime',
      billing_details: billing || {}
    });

    if (dbError) throw dbError;

    console.log(`[FOUNDING_INVOICE_CREATED] user_id=${user.id} invoice_id=${invoice.id}`);

    // Frontend handles redirect using invoice_url
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('[Founding Member] Payment creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
