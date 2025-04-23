
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
      // Get all activity logs for the teams
      const { data: logs, error } = await supabase
        .from('team_activity_logs')
        .select('*')
        .in('team_id', teamIds);
      
      if (error) {
        console.error("Error fetching activity logs:", error);
        return {};
      }

      console.log("Activity logs fetched:", logs);
      
      // Group logs by team_id
      const teamLogs: {[key: string]: {isLogged: boolean, partnerLogged: boolean}} = {};
      
      // Initialize all teams with default values
      teamIds.forEach(id => {
        teamLogs[id] = {isLogged: false, partnerLogged: false};
      });

      // Process each log entry
      logs?.forEach(log => {
        if (log.team_id) {
          // This check handles whether I'm the user or partner in this log entry
          if (log.user_id === currentUserId) {
            // I created this log for my partner
            teamLogs[log.team_id].isLogged = log.completed;
          } else if (log.partner_id === currentUserId) {
            // My partner created this log for me
            teamLogs[log.team_id].partnerLogged = log.completed;
          }
        }
      });
      
      console.log("Processed team logs:", teamLogs);
      return teamLogs;
    } catch (error) {
      console.error("Error in getActivityLogsForTeams:", error);
      return {};
    }
  }, []);
  
  // Check and remove expired teams
  const checkAndRemoveExpiredTeams = useCallback(async (userId: string, teams: any[]) => {
    if (!teams || teams.length === 0) return [];
    
    const now = new Date();
    const expiredTeams: string[] = [];
    
    // For each team, check if it's past the reset time
    teams.forEach(team => {
      const createdAt = new Date(team.created_at);
      let expiryTime = new Date(createdAt);
      
      // Set expiry based on frequency
      if (team.frequency === "Daily") {
        expiryTime.setDate(expiryTime.getDate() + 1);
      } else if (team.frequency === "Weekly") {
        expiryTime.setDate(expiryTime.getDate() + 7);
      }
      
      // If current time is past expiry and no activity has been logged
      if (now > expiryTime) {
        expiredTeams.push(team.id);
      }
    });
    
    // Remove expired teams from the database
    if (expiredTeams.length > 0) {
      try {
        // Delete teams
        const { error: teamError } = await supabase
          .from('teams')
          .delete()
          .in('id', expiredTeams)
          .contains('members', [userId]);
        
        if (teamError) {
          console.error("Error removing expired teams:", teamError);
        } else {
          // Delete activity logs for those teams
          const { error: logError } = await supabase
            .from('team_activity_logs')
            .delete()
            .in('team_id', expiredTeams);
            
          if (logError) {
            console.error("Error removing expired team logs:", logError);
          }
          
          // Notify of expired teams
          toast.info(`${expiredTeams.length} expired TagTeam(s) have been removed`, {
            duration: 4000
          });
        }
      } catch (error) {
        console.error("Error processing expired teams:", error);
      }
    }
    
    // Return non-expired teams
    return teams.filter(team => !expiredTeams.includes(team.id));
  }, []);

  // Subscribe to real-time changes in activity logs
  const subscribeToActivityLogs = useCallback((teamIds: string[], userId: string) => {
    if (!teamIds.length || !userId) return null;
    
    console.log("Setting up real-time subscription for teams:", teamIds);
    
    const channel = supabase
      .channel('activity-logs-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_activity_logs',
        filter: `team_id=in.(${teamIds.join(',')})`,
      }, (payload) => {
        console.log("Real-time update received:", payload);
        // Re-fetch teams to get updated status
        if (userId) fetchTagTeams(userId);
      })
      .subscribe();
      
    return channel;
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
      console.log("Fetched teams:", teams);

      if (!teams || teams.length === 0) {
        setTagTeams([]);
        setLoading(false);
        return;
      }
      
      // Check for expired teams and remove them
      const activeTeams = await checkAndRemoveExpiredTeams(uid, teams);

      if (!activeTeams || activeTeams.length === 0) {
        setTagTeams([]);
        setLoading(false);
        return;
      }

      // Get activity logs for all active teams
      const teamIds = activeTeams.map(t => t.id);
      const activityLogs = await getActivityLogsForTeams(teamIds, uid);

      const processedTeams = await Promise.all((activeTeams || []).map(async (team: any) => {
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
          memberNames = [memberProfiles[1].full_name || "Me", memberProfiles[0].full_name || "Partner"] as [string, string];
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
  }, [getProfileDataForMembers, getActivityLogsForTeams, checkAndRemoveExpiredTeams]);

  // Set up real-time subscription
  useEffect(() => {
    if (userId && tagTeams.length > 0) {
      const teamIds = tagTeams.map(team => team.id);
      const channel = subscribeToActivityLogs(teamIds, userId);
      
      // Cleanup subscription on unmount
      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [userId, tagTeams, subscribeToActivityLogs]);

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
