
import { supabase } from '@/integrations/supabase/client';

export interface TeamActivity {
  id: string;
  team_id: string;
  logged_by_user_id: string;
  verified_user_id: string;
  status: 'completed' | 'pending';
  created_at: string;
  cycle_start: string;
  cycle_end: string | null;
}

export const getLatestTeamActivities = async (teamId: string): Promise<TeamActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('team_activities')
      .select('*')
      .eq('team_id', teamId)
      .is('cycle_end', null)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as TeamActivity[];
  } catch (error) {
    console.error('Error fetching team activities:', error);
    throw error;
  }
};

export const logPartnerActivity = async (
  teamId: string,
  loggedByUserId: string,
  verifiedUserId: string,
  status: 'completed' | 'pending'
): Promise<TeamActivity> => {
  try {
    const { data, error } = await supabase
      .from('team_activities')
      .insert([{
        team_id: teamId,
        logged_by_user_id: loggedByUserId,
        verified_user_id: verifiedUserId,
        status
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data as TeamActivity;
  } catch (error) {
    console.error('Error logging partner activity:', error);
    throw error;
  }
};

export const closeActivityCycle = async (activityId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('team_activities')
      .update({ cycle_end: new Date().toISOString() })
      .eq('id', activityId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error closing activity cycle:', error);
    throw error;
  }
};

// This function will be useful to check if a user needs to log their partner's activity
export const hasActiveActivityLog = async (
  teamId: string, 
  loggedByUserId: string, 
  verifiedUserId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('team_activities')
      .select('id')
      .eq('team_id', teamId)
      .eq('logged_by_user_id', loggedByUserId)
      .eq('verified_user_id', verifiedUserId)
      .is('cycle_end', null)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is what we expect if there's no active log
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking for active activity log:', error);
    return false;
  }
};

