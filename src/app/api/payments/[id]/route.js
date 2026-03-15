import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data, error } = await supabase
    .from('crypto_payments')
    .select('*')
    .eq('payment_id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
