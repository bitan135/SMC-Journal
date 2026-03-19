import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { generateReferralCode } from '@/lib/affiliate-auth';

export async function POST(request) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if already an affiliate
    const { data: existing, error: fetchError } = await supabase
      .from('affiliates')
      .select('referral_code')
      .eq('id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Already an affiliate', 
        referralCode: existing.referral_code 
      });
    }

    // Generate unique code
    let referralCode;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      referralCode = generateReferralCode();
      const { data: existingCode } = await supabase
        .from('affiliates')
        .select('id')
        .eq('referral_code', referralCode)
        .single();
      
      if (!existingCode) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique referral code');
    }

    // Register as affiliate
    const { error: insertError } = await supabase
      .from('affiliates')
      .insert({
        id: user.id,
        referral_code: referralCode,
        total_referrals: 0,
        total_earnings_usd: 10.00 // Welcome bonus for testing
      });

    if (insertError) throw insertError;

    return NextResponse.json({ 
      success: true, 
      referralCode 
    });

  } catch (error) {
    console.error('[Affiliate Register] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
