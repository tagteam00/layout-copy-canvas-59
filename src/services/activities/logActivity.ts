
import { supabase } from "@/integrations/supabase/client";
import { createActivityStatusNotification } from "@/services/notificationService";

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
      // Using the correct parameter order with "activity_status" as the type
      await createActivityStatusNotification(
        verifiedUserId,  // Send to the partner
        partnerName,     // Partner's name
        "completed",     // Status as a string literal
        teamName,        // Team name
        teamId           // Team ID
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
