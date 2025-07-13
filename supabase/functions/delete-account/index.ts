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

    // Enhanced deletion with storage cleanup and verification
    try {
      // 1. Delete user's avatar from storage first
      const { data: avatarFiles } = await supabaseAdmin.storage
        .from('avatars')
        .list(user.id);

      if (avatarFiles && avatarFiles.length > 0) {
        const filePaths = avatarFiles.map(file => `${user.id}/${file.name}`);
        const { error: storageError } = await supabaseAdmin.storage
          .from('avatars')
          .remove(filePaths);
        
        if (storageError) {
          console.error('Error deleting storage files:', storageError);
          // Don't fail the entire deletion for storage errors, but log them
        } else {
          console.log(`Deleted ${filePaths.length} storage files for user ${user.id}`);
        }
      }

      // 2. Delete team activities (no foreign key dependencies)
      const { error: activitiesError } = await supabaseAdmin
        .from('team_activities')
        .delete()
        .or(`logged_by_user_id.eq.${user.id},verified_user_id.eq.${user.id}`);
      
      if (activitiesError) {
        console.error('Error deleting activities:', activitiesError);
        throw new Error(`Failed to delete team activities: ${activitiesError.message}`);
      }

      // 3. Delete team goals
      const { error: goalsError } = await supabaseAdmin
        .from('team_goals')
        .delete()
        .eq('user_id', user.id);
      
      if (goalsError) {
        console.error('Error deleting goals:', goalsError);
        throw new Error(`Failed to delete team goals: ${goalsError.message}`);
      }

      // 4. Delete team requests
      const { error: requestsError } = await supabaseAdmin
        .from('team_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      
      if (requestsError) {
        console.error('Error deleting requests:', requestsError);
        throw new Error(`Failed to delete team requests: ${requestsError.message}`);
      }

      // 5. Get teams where user is a member
      const { data: userTeams, error: teamsQueryError } = await supabaseAdmin
        .from('teams')
        .select('id, members')
        .contains('members', [user.id]);

      if (teamsQueryError) {
        console.error('Error querying user teams:', teamsQueryError);
        throw new Error(`Failed to query user teams: ${teamsQueryError.message}`);
      }

      // Update teams to remove user from members array, or delete if user is the only member
      if (userTeams) {
        for (const team of userTeams) {
          const updatedMembers = team.members.filter((memberId: string) => memberId !== user.id);
          
          if (updatedMembers.length === 0) {
            // Delete team if no members left
            const { error: deleteTeamError } = await supabaseAdmin
              .from('teams')
              .delete()
              .eq('id', team.id);
            
            if (deleteTeamError) {
              console.error('Error deleting team:', deleteTeamError);
              throw new Error(`Failed to delete team: ${deleteTeamError.message}`);
            }
          } else {
            // Update team to remove user and mark as ended by this user
            const { error: updateTeamError } = await supabaseAdmin
              .from('teams')
              .update({ 
                members: updatedMembers,
                ended_by: user.id,
                ended_at: new Date().toISOString()
              })
              .eq('id', team.id);
            
            if (updateTeamError) {
              console.error('Error updating team:', updateTeamError);
              throw new Error(`Failed to update team: ${updateTeamError.message}`);
            }
          }
        }
      }

      // 6. Delete notifications
      const { error: notificationsError } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
      
      if (notificationsError) {
        console.error('Error deleting notifications:', notificationsError);
        throw new Error(`Failed to delete notifications: ${notificationsError.message}`);
      }

      // 7. Delete user profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw new Error(`Failed to delete profile: ${profileError.message}`);
      }

      // 8. Verify critical data deletion
      const { data: remainingActivities } = await supabaseAdmin
        .from('team_activities')
        .select('id')
        .or(`logged_by_user_id.eq.${user.id},verified_user_id.eq.${user.id}`)
        .limit(1);

      const { data: remainingGoals } = await supabaseAdmin
        .from('team_goals')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const { data: remainingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .limit(1);

      if (remainingActivities?.length || remainingGoals?.length || remainingProfile?.length) {
        throw new Error('Data deletion verification failed - some user data remains');
      }

      // 9. Delete user from Supabase Auth (this must be last)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      
      if (authError) {
        console.error('Error deleting auth user:', authError);
        throw new Error(`Failed to delete user from auth: ${authError.message}`);
      }

    } catch (deletionError) {
      // If any step fails, log the error and still attempt to delete the auth user as fallback
      console.error('Error during data deletion:', deletionError);
      
      // Attempt to delete auth user as fallback to prevent orphaned accounts
      const { error: fallbackDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      if (fallbackDeleteError) {
        console.error('Fallback auth deletion also failed:', fallbackDeleteError);
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Account deletion failed', 
          details: deletionError instanceof Error ? deletionError.message : 'Unknown error' 
        }),
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