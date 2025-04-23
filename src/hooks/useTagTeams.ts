
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TagTeam } from "@/components/home/TagTeamList";

/**
 * Hook to fetch TagTeams, along with member names, initials & avatars.
 */
export function useTagTeams(userId: string | null) {
  const [tagTeams, setTagTeams] = useState<TagTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const getProfileDataForMembers = useCallback(async (memberIds: string[]) => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", memberIds);
      if (error) {
        console.error("Error fetching team member profiles:", error);
        return memberIds.map(() => ({
          full_name: "Team Member",
        }));
      }
      return memberIds.map((id) => profiles.find((p) => p.id === id) || { full_name: "Team Member" });
    } catch (error) {
      console.error("Error in getProfileDataForMembers:", error);
      return memberIds.map(() => ({ full_name: "Team Member" }));
    }
  }, []);

  const getActivityLogsForTeams = useCallback(async (teamIds: string[], currentUserId: string) => {
    try {
      const { data: logs, error } = await supabase
        .from('team_activity_logs')
        .select('*')
        .in('team_id', teamIds);
      
      if (error) {
        console.error("Error fetching activity logs:", error);
        return {};
      }

      // Group logs by team_id
      const teamLogs: {[key: string]: {isLogged: boolean, partnerLogged: boolean}} = {};
      teamIds.forEach(id => {
        teamLogs[id] = {isLogged: false, partnerLogged: false};
      });

      logs?.forEach(log => {
        if (log.team_id) {
          if (log.user_id === currentUserId) {
            // This is a log I created for my partner
            teamLogs[log.team_id].isLogged = log.completed;
          } else if (log.partner_id === currentUserId) {
            // This is a log my partner created for me
            teamLogs[log.team_id].partnerLogged = log.completed;
          }
        }
      });
      
      return teamLogs;
    } catch (error) {
      console.error("Error in getActivityLogsForTeams:", error);
      return {};
    }
  }, []);

  const fetchTagTeams = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const { data: teams, error } = await supabase
        .from('teams')
        .select('*')
        .contains('members', [uid]);
      
      if (error) {
        console.error("Error fetching teams:", error);
        return;
      }
      console.log("Fetched teams in Hub:", teams);

      if (!teams || teams.length === 0) {
        setTagTeams([]);
        setLoading(false);
        return;
      }

      // Get activity logs for all teams
      const teamIds = teams.map(t => t.id);
      const activityLogs = await getActivityLogsForTeams(teamIds, uid);

      const processedTeams = await Promise.all((teams || []).map(async (team: any) => {
        const [memberA, memberB] = team.members;
        const partnerId = memberA === uid ? memberB : memberA;

        // Fetch both members' profiles
        const memberProfiles = await getProfileDataForMembers([uid, partnerId]);
        
        // Make sure current user is always first in the array
        const currentUserIndex = team.members.indexOf(uid);
        let memberNames: [string, string] = ["", ""];
        let memberAvatars: [string | null, string | null] = [null, null];
        
        if (currentUserIndex === 0) {
          memberNames = [memberProfiles[0].full_name || "Me", memberProfiles[1].full_name || "Partner"] as [string, string];
        } else {
          memberNames = [memberProfiles[0].full_name || "Me", memberProfiles[1].full_name || "Partner"] as [string, string];
        }
        
        const getInitials = (name: string) => {
          if (!name) return "";
          const parts = name.split(" ");
          if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
          return (parts[0][0] + parts[1][0]).toUpperCase();
        };
        
        const memberInitials: [string, string] = [getInitials(memberNames[0]), getInitials(memberNames[1])];

        let timeLeft = "1 day";
        if (team.frequency && team.frequency.toLowerCase().includes("weekly")) {
          timeLeft = "7 days";
        }

        // Get activity status from logs
        const teamActivity = activityLogs[team.id] || { isLogged: false, partnerLogged: false };
        
        return {
          id: team.id,
          name: team.name,
          category: team.category,
          timeLeft: timeLeft,
          frequency: team.frequency,
          members: team.members,
          partnerId: partnerId,
          partnerName: memberProfiles[1]?.full_name || "Partner",
          isLogged: teamActivity.isLogged,
          partnerLogged: teamActivity.partnerLogged,
          memberNames,
          memberAvatars,
          memberInitials,
        };
      }));
      
      setTagTeams(processedTeams);
    } catch (error) {
      console.error("Error processing teams:", error);
      toast.error("Failed to load your TagTeams");
    } finally {
      setLoading(false);
    }
  }, [getProfileDataForMembers, getActivityLogsForTeams]);

  // Load on mount or userId change
  useEffect(() => {
    if (userId) {
      fetchTagTeams(userId);
    }
  }, [userId, fetchTagTeams]);

  // External trigger to refresh
  const refetch = () => {
    if (userId) fetchTagTeams(userId);
  };

  return { tagTeams, loading, refetch, setTagTeams };
}
