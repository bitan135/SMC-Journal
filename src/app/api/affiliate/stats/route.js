import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch Affiliate Stats
    const { data: stats, error: statsError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('id', user.id)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      throw statsError;
    }

    if (!stats) {
      return NextResponse.json({ stats: null, referrals: [] });
    }

    // 2. Fetch Recent Referrals
    const { data: referrals, error: refError } = await supabase
      .from('referrals')
      .select('*')
      .eq('affiliate_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (refError) throw refError;

    return NextResponse.json({ stats, referrals });

  } catch (error) {
    console.error('[Affiliate Stats] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
