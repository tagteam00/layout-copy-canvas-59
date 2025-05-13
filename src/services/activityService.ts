
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface TeamActivity {
  id: string;
  team_id: string;
  user_id: string;
  logged_by_user_id: string;
  status: "pending" | "completed";
  created_at: string;
  updated_at: string;
}

// Get the latest activity status for a specific user in a team
export const getLatestActivityStatus = async (teamId: string, userId: string): Promise<"pending" | "completed"> => {
  try {
    const { data, error } = await supabase
      .from('team_activities')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    return data?.length > 0 ? data[0].status as "pending" | "completed" : "pending";
  } catch (error) {
    console.error('Error fetching activity status:', error);
    return "pending";
  }
};

// Log activity status for a teammate
export const logActivityStatus = async (
  teamId: string,
  userId: string,
  loggedByUserId: string,
  status: "pending" | "completed"
): Promise<TeamActivity | null> => {
  try {
    // Check if there's an existing activity log
    const { data: existingData } = await supabase
      .from('team_activities')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .eq('logged_by_user_id', loggedByUserId)
      .limit(1);
    
    let result;
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('team_activities')
        .update({ status })
        .eq('id', existingData[0].id)
        .select('*')
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('team_activities')
        .insert([{ 
          team_id: teamId, 
          user_id: userId, 
          logged_by_user_id: loggedByUserId,
          status 
        }])
        .select('*')
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error('Error logging activity status:', error);
    toast.error("Failed to update status");
    return null;
  }
};

// Define the type for the RPC result
interface TeamActivityStatus {
  user_id: string;
  status: "pending" | "completed";
}

// Get all latest activity statuses for a team
export const getTeamActivities = async (teamId: string): Promise<Map<string, "pending" | "completed">> => {
  try {
    // Use a custom query to get only the latest activity for each user
    const { data, error } = await supabase
      .rpc('get_latest_team_activities', { team_id_param: teamId });
    
    if (error) {
      // Fallback if RPC doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('team_activities')
        .select('*')
        .eq('team_id', teamId)
        .order('updated_at', { ascending: false });
      
      if (fallbackError) throw fallbackError;
      
      // Process fallback data to get latest status for each user
      const statusMap = new Map<string, "pending" | "completed">();
      
      if (fallbackData) {
        const processedUsers = new Set<string>();
        
        fallbackData.forEach((activity: TeamActivity) => {
          // Only add the first (most recent) status for each user
          if (!processedUsers.has(activity.user_id)) {
            statusMap.set(activity.user_id, activity.status);
            processedUsers.add(activity.user_id);
          }
        });
      }
      
      return statusMap;
    }
    
    // Process the RPC data
    const statusMap = new Map<string, "pending" | "completed">();
    
    if (data) {
      // Add type assertion to ensure TypeScript knows data is an array of TeamActivityStatus
      const typedData = data as TeamActivityStatus[];
      typedData.forEach((activity) => {
        statusMap.set(activity.user_id, activity.status);
      });
    }
    
    return statusMap;
  } catch (error) {
    console.error('Error fetching team activities:', error);
    return new Map<string, "pending" | "completed">();
  }
};
