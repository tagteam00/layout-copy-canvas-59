
import { supabase } from "@/integrations/supabase/client";
import { createActivityStatusNotification, createTimerWarningNotification } from "@/services/notificationService";
import { NotificationTriggerPoint } from "@/utils/timerUtils";

// Define the TeamActivity type
export interface TeamActivity {
  id: string;
  team_id: string;
  logged_by_user_id: string;
  verified_user_id: string;
  status: "pending" | "completed";
  created_at: string;
  cycle_start: string;
  cycle_end: string | null;
}

// Function to check if a user needs a timer reset warning notification
export const checkAndSendTimerWarning = async (
  teamId: string,
  userId: string,
  partnerId: string,
  teamName: string,
  timeRemaining: string,
  urgency: NotificationTriggerPoint
): Promise<boolean> => {
  try {
    // First, check if the activity is already completed by both users
    const isActivityCompleted = await checkTeamGoalCompletion(teamId, userId, partnerId);
    
    // If activity is completed, don't send a warning
    if (isActivityCompleted) {
      console.log(`Skipping timer warning for ${teamId} as activity is already completed`);
      return false;
    }
    
    const notification = await createTimerWarningNotification(
      userId,
      teamName,
      timeRemaining,
      urgency,
      teamId
    );
    
    return !!notification;
  } catch (error) {
    console.error('Error checking/sending timer warning:', error);
    return false;
  }
};

// Function to log a partner's activity status
export const logPartnerActivity = async (
  teamId: string,
  loggedByUserId: string,
  verifiedUserId: string,
  status: "completed" | "pending",
  teamName: string,
  partnerName: string
): Promise<boolean> => {
  try {
    // Log the activity
    const { data: activityData, error: activityError } = await supabase
      .from('team_activities')
      .insert([
        {
          team_id: teamId,
          logged_by_user_id: loggedByUserId,
          verified_user_id: verifiedUserId,
          status: status
        }
      ])
      .select()
      .single();
    
    if (activityError) throw activityError;
    
    // Create a notification for the partner
    if (status === "completed") {
      await createActivityStatusNotification(
        verifiedUserId,  // Send to the partner
        loggedByUserId,  // From the current user
        `${partnerName} marked your goal in ${teamName} as completed!`,
        teamId
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error logging partner activity:', error);
    return false;
  }
};

// Function to check if user has already logged an activity for this partner in the current cycle
export const hasActiveActivityLog = async (
  teamId: string,
  loggedByUserId: string,
  verifiedUserId: string
): Promise<boolean> => {
  try {
    // Get the most recent activity log for this team, user, and partner
    const { data, error } = await supabase
      .from('team_activities')
      .select('*')
      .eq('team_id', teamId)
      .eq('logged_by_user_id', loggedByUserId)
      .eq('verified_user_id', verifiedUserId)
      .is('cycle_end', null)  // Current cycle (not closed yet)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    return !!data && data.length > 0;
  } catch (error) {
    console.error('Error checking for active activity log:', error);
    return false;
  }
};

// Function to check if both team members have completed their goals
export const checkTeamGoalCompletion = async (
  teamId: string,
  firstUserId: string,
  secondUserId: string
): Promise<boolean> => {
  try {
    // Get team activities for both users logging each other as completed
    const { data: firstUserLogging, error: error1 } = await supabase
      .from('team_activities')
      .select('*')
      .eq('team_id', teamId)
      .eq('logged_by_user_id', firstUserId)
      .eq('verified_user_id', secondUserId)
      .eq('status', 'completed')
      .is('cycle_end', null)  // Current cycle
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error1) throw error1;
    
    const { data: secondUserLogging, error: error2 } = await supabase
      .from('team_activities')
      .select('*')
      .eq('team_id', teamId)
      .eq('logged_by_user_id', secondUserId)
      .eq('verified_user_id', firstUserId)
      .eq('status', 'completed')
      .is('cycle_end', null)  // Current cycle
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error2) throw error2;
    
    // Both users must have logged each other as completed
    const bothCompleted = 
      firstUserLogging && 
      firstUserLogging.length > 0 && 
      secondUserLogging && 
      secondUserLogging.length > 0;
      
    return bothCompleted;
  } catch (error) {
    console.error('Error checking team goal completion:', error);
    return false;
  }
};

// Function to get the latest team activities for a team
export const getLatestTeamActivities = async (teamId: string): Promise<TeamActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('team_activities')
      .select('*')
      .eq('team_id', teamId)
      .is('cycle_end', null)  // Current cycle
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching latest team activities:', error);
    return [];
  }
};
