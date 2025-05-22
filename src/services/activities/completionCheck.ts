
import { supabase } from "@/integrations/supabase/client";
import { TeamActivity } from "./types";

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
    
    // Cast the data to ensure it matches the TeamActivity type
    return (data || []).map(item => ({
      id: item.id,
      team_id: item.team_id,
      logged_by_user_id: item.logged_by_user_id,
      verified_user_id: item.verified_user_id,
      status: item.status as "pending" | "completed", // Type assertion to handle the status
      created_at: item.created_at,
      cycle_start: item.cycle_start,
      cycle_end: item.cycle_end
    })) as TeamActivity[];
  } catch (error) {
    console.error('Error fetching latest team activities:', error);
    return [];
  }
};
