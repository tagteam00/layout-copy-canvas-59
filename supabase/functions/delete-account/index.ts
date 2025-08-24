// Delete account Edge Function
// - Authenticated user invokes this function
// - Deletes all user-related data in public schema and the auth user
// - Uses service role key to bypass RLS

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Client bound to the end-user to read their identity
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  // Admin client to perform privileged operations
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: userErr?.message || 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    const userId = userData.user.id;

    // 1) Remove storage avatar assets (best-effort)
    try {
      const list = await admin.storage.from('avatars').list(userId, { limit: 100 });
      if (list.data && list.data.length > 0) {
        const paths = list.data.map((f) => `${userId}/${f.name}`);
        if (paths.length) {
          await admin.storage.from('avatars').remove(paths);
        }
      }
    } catch (e) {
      console.log('Storage cleanup skipped/failed:', e);
    }

    // 2) Delete user-related rows across tables
    const deletes = [
      admin.from('notifications').delete().eq('user_id', userId),
      admin.from('team_requests').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`),
      admin.from('team_activities').delete().or(`logged_by_user_id.eq.${userId},verified_user_id.eq.${userId}`),
      admin.from('team_goals').delete().eq('user_id', userId),
      admin.from('profiles').delete().eq('id', userId),
      // Remove any teams this user is part of (2-person micro teams)
      admin.from('teams').delete().contains('members', [userId]),
    ];

    for (const op of deletes) {
      const { error } = await op;
      if (error) console.log('Delete op warning:', error.message);
    }

    // 3) Finally delete the auth user
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (e: any) {
    console.error('Unexpected error during account deletion:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
