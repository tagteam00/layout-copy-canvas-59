import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeleteAccountRequest {
  confirm: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Initialize regular client for auth
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { confirm }: DeleteAccountRequest = await req.json();
    
    if (!confirm) {
      return new Response(
        JSON.stringify({ error: 'Confirmation required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting account deletion for user: ${user.id}`);

    // Delete user data in the correct order (respecting foreign key constraints)
    
    // 1. Delete team activities (no foreign key dependencies)
    const { error: activitiesError } = await supabaseAdmin
      .from('team_activities')
      .delete()
      .or(`logged_by_user_id.eq.${user.id},verified_user_id.eq.${user.id}`);
    
    if (activitiesError) console.error('Error deleting activities:', activitiesError);

    // 2. Delete team goals
    const { error: goalsError } = await supabaseAdmin
      .from('team_goals')
      .delete()
      .eq('user_id', user.id);
    
    if (goalsError) console.error('Error deleting goals:', goalsError);

    // 3. Delete team requests
    const { error: requestsError } = await supabaseAdmin
      .from('team_requests')
      .delete()
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
    
    if (requestsError) console.error('Error deleting requests:', requestsError);

    // 4. Get teams where user is a member
    const { data: userTeams } = await supabaseAdmin
      .from('teams')
      .select('id, members')
      .contains('members', [user.id]);

    // Update teams to remove user from members array, or delete if user is the only member
    if (userTeams) {
      for (const team of userTeams) {
        const updatedMembers = team.members.filter((memberId: string) => memberId !== user.id);
        
        if (updatedMembers.length === 0) {
          // Delete team if no members left
          await supabaseAdmin.from('teams').delete().eq('id', team.id);
        } else {
          // Update team to remove user
          await supabaseAdmin
            .from('teams')
            .update({ members: updatedMembers })
            .eq('id', team.id);
        }
      }
    }

    // 5. Delete notifications
    const { error: notificationsError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('user_id', user.id);
    
    if (notificationsError) console.error('Error deleting notifications:', notificationsError);

    // 6. Delete user profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user.id);
    
    if (profileError) console.error('Error deleting profile:', profileError);

    // 7. Delete user from Supabase Auth (this must be last)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (authError) {
      console.error('Error deleting auth user:', authError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully deleted account for user: ${user.id}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Account deleted successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in delete-account function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});