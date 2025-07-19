
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Team } from "@/services/teamService";
import { toast } from "sonner";
import { TransformedTeam } from "@/types/tagteam";
import { getLatestTeamActivities, TeamActivity } from "@/services/activityService";
import { closeAllExpiredActivityCycles } from "@/services/activities/cycleManagement";

export const useTeamData = (userId: string, userFullName: string) => {
  const [tagTeams, setTagTeams] = useState<TransformedTeam[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch user teams
  const fetchUserTeams = async () => {
    try {
      if (!userId) return;
      
      console.log('Fetching teams for user:', userId);
      
      // Close any expired cycles before fetching team data
      await closeAllExpiredActivityCycles();
      
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('*')
        .contains('members', [userId])
        .is('ended_at', null);  // This ensures we only get teams that are not ended
        
      if (error) {
        throw error;
      }
      
      console.log('Teams fetched:', teamsData);
      
      // Transform team data for display
      if (teamsData) {
        const transformedTeams = await Promise.all(teamsData.map(async (team: Team) => {
          // Get the partner ID (the other member that is not the current user)
          const partnerId = team.members.find((id: string) => id !== userId);
          
          // Fetch current user profile for instagram handle
          const { data: currentUserData } = await supabase
            .from('profiles')
            .select('instagram_handle')
            .eq('id', userId)
            .single();
          
          // Fetch partner profile
          const { data: partnerData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', partnerId)
            .single();
          
          // Extract reset day from frequency if it's weekly
          let resetDay;
          if (team.frequency.toLowerCase().includes('weekly')) {
            const match = team.frequency.match(/\((.*?)\)/);
            resetDay = match ? match[1] : undefined;
          }

          // Fetch the latest activity statuses for this team
          let firstUserStatus: "pending" | "completed" = "pending";
          let secondUserStatus: "pending" | "completed" = "pending";

          try {
            const activities = await getLatestTeamActivities(team.id);
            
            // Find activity where current user logs partner's status
            const currentUserLoggedActivity = activities.find(
              activity => activity.logged_by_user_id === userId && activity.verified_user_id === partnerId
            );
            
            // Find activity where partner logs current user's status
            const partnerLoggedActivity = activities.find(
              activity => activity.logged_by_user_id === partnerId && activity.verified_user_id === userId
            );
            
            // Set statuses based on activities
            if (partnerLoggedActivity) {
              firstUserStatus = partnerLoggedActivity.status;
            }
            
            if (currentUserLoggedActivity) {
              secondUserStatus = currentUserLoggedActivity.status;
            }
          } catch (err) {
            console.error("Error fetching activity status:", err);
          }
            
          return {
            id: team.id,
            name: team.name,
            firstUser: {
              id: userId,
              name: userFullName,
              status: firstUserStatus,
              goal: "Will do Push pull legs the entire week, and take as much protien as I can", // Example goal
              instagramHandle: ""
            },
            secondUser: {
              id: partnerId || "",
              name: partnerData?.full_name || "Partner",
              status: secondUserStatus,
              goal: "", // Empty goal for example
              instagramHandle: ""
            },
            interest: team.category,
            frequency: team.frequency,
            resetDay: resetDay,
            resetTime: "00:30:00", // Example reset time
            ended_at: team.ended_at,
            ended_by: team.ended_by
          };
        }));
        
        setTagTeams(transformedTeams);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for team activities
  useEffect(() => {
    if (!userId) return;

    // Subscribe to changes in team_activities table
    const channel = supabase
      .channel('team-activities-changes')
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'team_activities',
        }, 
        (payload) => {
          console.log('New activity logged:', payload);
          // Refresh the teams data when a new activity is logged
          fetchUserTeams();
        }
      )
      .on(
        'postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'team_activities',
        }, 
        (payload) => {
          console.log('Activity updated (cycle possibly closed):', payload);
          // Refresh the teams data when an activity is updated (cycle closure)
          fetchUserTeams();
        }
      )
      .subscribe();

    return () => {
      // Clean up subscription on unmount
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Expose the ability to refresh teams
  const refreshTeams = async () => {
    setLoading(true);
    await fetchUserTeams();
  };

  return { tagTeams, loading, fetchUserTeams, refreshTeams };
};
