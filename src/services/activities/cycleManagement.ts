
import { supabase } from "@/integrations/supabase/client";

// Function to close expired cycles for a specific team
export const closeTeamActivityCycle = async (teamId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('close_team_activity_cycle', {
      team_id_param: teamId
    });
    
    if (error) throw error;
    
    console.log(`Closed ${data || 0} expired cycles for team ${teamId}`);
    return data || 0;
  } catch (error) {
    console.error('Error closing team activity cycle:', error);
    return 0;
  }
};

// Function to close all expired cycles across all teams
export const closeAllExpiredActivityCycles = async (): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('close_expired_activity_cycles');
    
    if (error) throw error;
    
    console.log(`Closed ${data || 0} expired cycles across all teams`);
    return data || 0;
  } catch (error) {
    console.error('Error closing expired activity cycles:', error);
    return 0;
  }
};

// Function to check if a team needs cycle closure based on timer reset
export const checkAndCloseCycleOnReset = async (
  teamId: string,
  frequency: string,
  resetDay?: string
): Promise<boolean> => {
  try {
    // Close any expired cycles for this team
    const cyclesClosed = await closeTeamActivityCycle(teamId);
    
    if (cyclesClosed > 0) {
      console.log(`Reset detected: Closed ${cyclesClosed} cycles for team ${teamId}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking and closing cycles on reset:', error);
    return false;
  }
};
