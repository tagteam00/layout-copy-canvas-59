
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Team } from "@/services/teamService";
import { toast } from "sonner";
import { TransformedTeam } from "@/types/tagteam";

export const useTeamData = (userId: string, userFullName: string) => {
  const [tagTeams, setTagTeams] = useState<TransformedTeam[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch user teams
  const fetchUserTeams = async () => {
    try {
      if (!userId) return;
      
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('*')
        .contains('members', [userId])
        .is('ended_at', null);
        
      if (error) {
        throw error;
      }
      
      // Transform team data for display
      if (teamsData) {
        const transformedTeams = await Promise.all(teamsData.map(async (team: Team) => {
          // Get the partner ID (the other member that is not the current user)
          const partnerId = team.members.find((id: string) => id !== userId);
          
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
            
          return {
            id: team.id,
            name: team.name,
            firstUser: {
              id: userId,
              name: userFullName,
              status: "pending" as const, // For now, hardcoded
              goal: "Will do Push pull legs the entire week, and take as much protien as I can" // Example goal
            },
            secondUser: {
              id: partnerId || "",
              name: partnerData?.full_name || "Partner",
              status: "completed" as const, // For now, hardcoded
              goal: "" // Empty goal for example
            },
            interest: team.category,
            frequency: team.frequency,
            resetDay: resetDay,
            resetTime: "00:30:00", // Example reset time
            ended_at: team.ended_at,
            ended_by: team.ended_by
          };
        }));
        
        // Filter out any teams that have ended
        const activeTeams = transformedTeams.filter(team => !team.ended_at);
        setTagTeams(activeTeams);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  // Expose the ability to refresh teams
  const refreshTeams = async () => {
    setLoading(true);
    await fetchUserTeams();
  };

  return { tagTeams, loading, fetchUserTeams, refreshTeams };
};
