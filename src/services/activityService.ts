
import { supabase } from '@/integrations/supabase/client';
import { createNotification } from './goalService';

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
  status: 'completed' | 'pending',
  teamName?: string,
  partnerName?: string
): Promise<TeamActivity> => {
  try {
    // Log the activity first
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
    
    // Once activity is logged, send a notification to the verified user
    if (teamName && partnerName) {
      const statusText = status === 'completed' ? 'completed' : 'pending';
      const message = `${partnerName} has marked your activity as ${statusText} in "${teamName}"`;
      
      await createNotification(
        verifiedUserId, 
        message, 
        'activity_status_update', 
        teamId
      );
    }
    
    return data as TeamActivity;
  } catch (error) {
    console.error('Error logging partner activity:', error);
    throw error;
  }
};

// Function to check if a user needs a timer reset warning notification
export const checkAndSendTimerWarning = async (
  teamId: string,
  userId: string,
  teamName: string,
  timeRemaining: string,
  urgency: 'normal' | 'warning' | 'urgent'
): Promise<boolean> => {
  try {
    // Only send warnings for warning or urgent timers
    if (urgency === 'normal') return false;
    
    // Check if we've already sent a warning notification recently for this team
    const { data: existingWarnings } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('related_id', teamId)
      .eq('related_to', 'timer_warning')
      .gt('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()) // Last 12 hours
      .limit(1);
      
    // If we already sent a warning recently, don't send another one
    if (existingWarnings && existingWarnings.length > 0) return false;
    
    // Send a warning notification
    const urgencyText = urgency === 'urgent' ? 'urgently ' : '';
    const message = `Your TagTeam "${teamName}" timer is ${urgencyText}about to reset (${timeRemaining} remaining). Don't forget to log your activity!`;
    
    await createNotification(
      userId,
      message,
      'timer_warning',
      teamId
    );
    
    return true;
  } catch (error) {
    console.error('Error checking/sending timer warning:', error);
    return false;
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
