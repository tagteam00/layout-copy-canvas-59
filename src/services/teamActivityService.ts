
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TeamActivity {
  id: string;
  team_id: string;
  user_id: string;
  cycle_start: string;
  cycle_end?: string;
  status: "completed" | "pending";
  updated_at: string;
}

// Create or update an activity status for a user in a team
export const updateActivityStatus = async (
  teamId: string,
  userId: string,
  status: "completed" | "pending"
): Promise<TeamActivity | null> => {
  try {
    // Calculate cycle dates based on current time
    const now = new Date();
    const cycleStart = new Date();
    cycleStart.setHours(0, 0, 0, 0); // Start of today
    
    const cycleEnd = new Date();
    cycleEnd.setHours(23, 59, 59, 999); // End of today
    
    // Check if an activity already exists for this user in the current cycle
    const { data: existingActivity } = await supabase
      .from("team_activities")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .gte("cycle_start", cycleStart.toISOString())
      .lte("cycle_start", cycleEnd.toISOString())
      .maybeSingle();
    
    if (existingActivity) {
      // Update existing activity
      const { data, error } = await supabase
        .from("team_activities")
        .update({
          status,
          updated_at: now.toISOString(),
        })
        .eq("id", existingActivity.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create a new activity
      const { data, error } = await supabase
        .from("team_activities")
        .insert({
          team_id: teamId,
          user_id: userId,
          status,
          cycle_start: cycleStart.toISOString(),
          cycle_end: cycleEnd.toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error updating activity status:", error);
    toast.error("Failed to update activity status");
    return null;
  }
};

// Fetch activities for a team
export const getTeamActivities = async (teamId: string): Promise<TeamActivity[]> => {
  try {
    const { data, error } = await supabase
      .from("team_activities")
      .select("*")
      .eq("team_id", teamId)
      .order("updated_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching team activities:", error);
    toast.error("Failed to load activity statuses");
    return [];
  }
};

// Get the latest activity for a specific team member
export const getMemberLatestActivity = async (
  teamId: string,
  userId: string
): Promise<TeamActivity | null> => {
  try {
    const { data, error } = await supabase
      .from("team_activities")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching member activity:", error);
    return null;
  }
};

// Subscribe to activity changes for a team
export const subscribeToTeamActivities = (
  teamId: string,
  callback: (activities: TeamActivity) => void
) => {
  return supabase
    .channel(`team-activities-${teamId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
        schema: "public",
        table: "team_activities",
        filter: `team_id=eq.${teamId}`,
      },
      (payload) => {
        callback(payload.new as TeamActivity);
      }
    )
    .subscribe();
};
