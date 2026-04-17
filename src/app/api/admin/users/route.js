import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/admin-auth';

function getSbAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET(req) {
  try {
    const store = await cookies();
    const session = await getAdminSession(store);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sb = getSbAdmin();
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = (searchParams.get('search') || '').toLowerCase();
    const filterPlan = searchParams.get('plan');
    const filterStatus = searchParams.get('status');

    // Fetch up to 10k users for memory-based search, suitable for early stage apps.
    // If it exceeds this, server-side pagination with a custom Postgres function is needed.
    const { data: authData, error: authError } = await sb.auth.admin.listUsers({ page: 1, perPage: 10000 });
    if (authError) throw authError;

    const authUsers = authData.users || [];

    const { data: profiles, error: profilesError } = await sb.from('profiles').select('*');
    if (profilesError) throw profilesError;

    const { data: subscriptions } = await sb.from('subscriptions').select('user_id, plan_id, status');

    // Create a map of profiles
    const profilesMap = new Map((profiles || []).map(p => [p.id, p]));
    const subsMap = new Map((subscriptions || []).map(s => [s.user_id, s]));

    // Fetch affiliates mapping
    const { data: referrals } = await sb.from('affiliate_referrals').select('user_id, affiliate_id');
    const { data: affiliates } = await sb.from('affiliates').select('id, name, coupon_code');
    
    const affiliatesMap = new Map((affiliates || []).map(a => [a.id, a]));
    const userReferralMap = new Map((referrals || []).map(r => [r.user_id, affiliatesMap.get(r.affiliate_id)]));

    // Combine and build users array
    let usersList = authUsers.map(au => {
      const p = profilesMap.get(au.id) || {};
      const sub = subsMap.get(au.id) || {};
      const partner = userReferralMap.get(au.id);

      // Normalize lifetime checks across both tables
      let computedPlan = p.plan_type || 'free';
      const subPlan = sub.plan_id;
      
      if (
        computedPlan === 'pro_lifetime' || 
        computedPlan === 'lifetime_legacy' || 
        computedPlan === 'lifetime' || 
        subPlan === 'lifetime' ||
        subPlan === 'lifetime_legacy'
      ) {
        computedPlan = 'lifetime';
      }

      return {
        id: au.id,
        email: au.email,
        name: p.full_name || 'No Name',
        plan: computedPlan,
        isPro: !!p.is_pro || computedPlan === 'lifetime' || subPlan === 'pro',
        status: p.status || 'active',
        joinDate: au.created_at,
        lastLogin: au.last_sign_in_at,
        partnerName: partner?.name || null,
        couponCode: partner?.coupon_code || null,
      };
    });

    // Compute basic stats before filtering
    const stats = {
      totalUsers: usersList.length,
      freeUsers: usersList.filter(u => u.plan === 'free').length,
      proUsers: usersList.filter(u => u.plan === 'pro' || u.plan === 'pro_monthly' || (u.plan !== 'free' && u.plan !== 'lifetime')).length,
      lifetimeUsers: usersList.filter(u => u.plan === 'lifetime').length,
    };

    // Apply filtering
    if (search) {
      usersList = usersList.filter(u => 
        (u.email && u.email.toLowerCase().includes(search)) ||
        (u.name && u.name.toLowerCase().includes(search)) ||
        (u.couponCode && u.couponCode.toLowerCase().includes(search))
      );
    }
    if (filterPlan && filterPlan !== 'all') {
      if (filterPlan === 'pro') usersList = usersList.filter(u => u.plan !== 'free' && u.plan !== 'lifetime');
      else usersList = usersList.filter(u => u.plan === filterPlan);
    }
    if (filterStatus && filterStatus !== 'all') {
      usersList = usersList.filter(u => u.status === filterStatus);
    }

    // Sort by join date descending
    usersList.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));

    // Pagination
    const totalFiltered = usersList.length;
    const totalPages = Math.ceil(totalFiltered / limit);
    const startIdx = (page - 1) * limit;
    const paginatedUsers = usersList.slice(startIdx, startIdx + limit);

    return NextResponse.json({
      users: paginatedUsers,
      stats,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages
      }
    });

  } catch (err) {
    console.error('Admin Fetch Users Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
