import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/admin-auth';

function getSbAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// Helper to log admin actions
async function logAction(sb, adminEmail, action, targetUserId, details = {}) {
  try {
    await sb.from('admin_action_logs').insert({
      admin_email: adminEmail,
      action,
      target_user_id: targetUserId,
      details
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

export async function PATCH(req, { params }) {
  try {
    const store = await cookies();
    const session = await getAdminSession(store);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const sb = getSbAdmin();

    const updates = {};
    if (body.plan) updates.plan_type = body.plan;
    if (body.isPro !== undefined) updates.is_pro = body.isPro;
    if (body.status) updates.status = body.status;

    let subUpsert = null;

    if (body.extendMonths) {
      const { data: profile } = await sb.from('profiles').select('subscription_end_date').eq('id', id).single();
      const currentEnd = profile?.subscription_end_date ? new Date(profile.subscription_end_date) : null;
      let newEnd = new Date();
      if (currentEnd && currentEnd > new Date()) {
        newEnd = currentEnd;
      }
      newEnd.setMonth(newEnd.getMonth() + Number(body.extendMonths));
      
      updates.subscription_end_date = newEnd.toISOString();
      updates.plan_type = 'pro'; 
      updates.is_pro = true;

      // Ensure subscriptions table reflects the extension
      subUpsert = {
        user_id: id,
        plan_id: 'pro',
        status: 'active',
        current_period_end: updates.subscription_end_date,
        updated_at: new Date().toISOString()
      };
    }

    if (body.plan === 'lifetime') {
      updates.plan_type = 'lifetime';
      updates.is_pro = true;
      updates.subscription_start_date = new Date().toISOString();
      updates.subscription_end_date = null; // Perpetual

      subUpsert = {
        user_id: id,
        plan_id: 'lifetime',
        status: 'active',
        current_period_end: null,
        updated_at: new Date().toISOString()
      };
    } else if (body.plan === 'free') {
      subUpsert = {
        user_id: id,
        plan_id: 'free',
        status: 'active',
        current_period_end: null, // Free plans don't expire and shouldn't trigger lockout
        updated_at: new Date().toISOString()
      };
      updates.subscription_end_date = null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
    }

    // Update the profile
    const { error: profileError } = await sb.from('profiles').update(updates).eq('id', id);
    if (profileError) throw profileError;

    // Sync to subscriptions table to ensure PlanGuard resolves it correctly
    if (subUpsert) {
      await sb.from('subscriptions').upsert(subUpsert, { onConflict: 'user_id' });
    }

    // Log the action
    await logAction(sb, session.email, 'UPDATE_USER', id, updates);

    return NextResponse.json({ success: true, updates });

  } catch (err) {
    console.error('Admin Update User Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const store = await cookies();
    const session = await getAdminSession(store);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const sb = getSbAdmin();

    // Delete user from auth (this cascades to profiles and subscriptions depending on FK rules, 
    // but auth.admin.deleteUser is the definitive way to wipe a user)
    const { error } = await sb.auth.admin.deleteUser(id);
    if (error) throw error;

    await logAction(sb, session.email, 'DELETE_USER', id, { note: 'User completely deleted from system' });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin Delete User Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
