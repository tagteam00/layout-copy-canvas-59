// Purge All Users Edge Function
// DANGEROUS: This function deletes ALL users and their data from the database
// Only use this for development/testing purposes with proper admin authentication

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
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const ADMIN_PURGE_TOKEN = Deno.env.get('ADMIN_PURGE_TOKEN')!;

  try {
    const { adminToken } = await req.json();
    
    // Verify admin token
    if (!adminToken || adminToken !== ADMIN_PURGE_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid admin token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Admin client to perform privileged operations
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    console.log('Starting database purge...');

    // 1) Clear all storage buckets (best-effort)
    try {
      const { data: buckets } = await admin.storage.listBuckets();
      if (buckets) {
        for (const bucket of buckets) {
          const { data: files } = await admin.storage.from(bucket.name).list('', { limit: 1000 });
          if (files && files.length > 0) {
            const filePaths = files.map(file => file.name);
            await admin.storage.from(bucket.name).remove(filePaths);
            console.log(`Cleared ${filePaths.length} files from bucket: ${bucket.name}`);
          }
        }
      }
    } catch (e) {
      console.log('Storage cleanup warning:', e);
    }

    // 2) Delete all data from public tables in correct order (respecting foreign keys)
    const tablesToClear = [
      'notifications',
      'team_requests', 
      'team_activities',
      'team_goals',
      'profiles',
      'teams'
    ];

    let totalRowsDeleted = 0;
    for (const table of tablesToClear) {
      try {
        const { data, error } = await admin.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
          console.log(`Warning clearing table ${table}:`, error.message);
        } else {
          console.log(`Cleared table: ${table}`);
          totalRowsDeleted += (data?.length || 0);
        }
      } catch (e) {
        console.log(`Error clearing table ${table}:`, e);
      }
    }

    // 3) Get all users from auth.users and delete them
    const { data: users, error: usersError } = await admin.auth.admin.listUsers();
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return new Response(JSON.stringify({ error: usersError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    let usersDeleted = 0;
    if (users && users.users.length > 0) {
      for (const user of users.users) {
        const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
        if (deleteError) {
          console.log(`Warning deleting user ${user.id}:`, deleteError.message);
        } else {
          usersDeleted++;
        }
      }
    }

    console.log(`Purge completed: ${usersDeleted} users deleted, ${totalRowsDeleted} data rows cleared`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Database purged successfully. Deleted ${usersDeleted} users and cleared ${totalRowsDeleted} data rows.`,
      usersDeleted,
      rowsDeleted: totalRowsDeleted
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (e: any) {
    console.error('Unexpected error during database purge:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});