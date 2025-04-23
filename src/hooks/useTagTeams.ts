
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TagTeam } from "@/components/home/TagTeamList";
import { RealtimeChannel } from "@supabase/supabase-js";
import { addDays } from "date-fns";

/**
 * Hook to fetch TagTeams, along with member names, initials & avatars.
 * Also includes real-time subscription for activity logs.
 */
export function useTagTeams(userId: string | null) {
  const [tagTeams, setTagTeams] = useState<TagTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

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
      const teamLogs: {[key: string]: {
        isLogged: boolean, 
        partnerLogged: boolean,
        resetTime?: string
      }} = {};
      
      teamIds.forEach(id => {
        teamLogs[id] = {
          isLogged: false, 
          partnerLogged: false,
          resetTime: undefined
        };
      });

      logs?.forEach(log => {
        if (log.team_id) {
          if (log.user_id === currentUserId) {
            // This is a log I created for my partner
            teamLogs[log.team_id].isLogged = log.completed;
            
            // Store reset time (period_end) for the team
            if (log.period_end && (!teamLogs[log.team_id].resetTime || new Date(log.period_end) > new Date(teamLogs[log.team_id].resetTime!))) {
              teamLogs[log.team_id].resetTime = log.period_end;
            }
          } else if (log.partner_id === currentUserId) {
            // This is a log my partner created for me
            teamLogs[log.team_id].partnerLogged = log.completed;
            
            // Store reset time (period_end) for the team
            if (log.period_end && (!teamLogs[log.team_id].resetTime || new Date(log.period_end) > new Date(teamLogs[log.team_id].resetTime!))) {
              teamLogs[log.team_id].resetTime = log.period_end;
            }
          }
        }
      });
      
      return teamLogs;
    } catch (error) {
      console.error("Error in getActivityLogsForTeams:", error);
      return {};
    }
  }, []);

  const processTeams = useCallback(async (teams: any[], uid: string, activityLogs: any) => {
    return Promise.all(teams.map(async (team: any) => {
      const [memberA, memberB] = team.members;
      const partnerId = memberA === uid ? memberB : memberA;

      // Fetch both members' profiles
      const memberProfiles = await getProfileDataForMembers([uid, partnerId]);
      
      // Make sure current user is always first in the array
      let memberNames: [string, string] = ["", ""];
      let memberAvatars: [string | null, string | null] = [null, null];
      
      if (team.members.indexOf(uid) === 0) {
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

      // Calculate time left based on frequency or reset time
      const teamActivity = activityLogs[team.id] || { isLogged: false, partnerLogged: false };
      
      let resetTime;
      let timeLeft = "1 day";
      
      if (teamActivity.resetTime) {
        resetTime = teamActivity.resetTime;
        timeLeft = resetTime;
      } else {
        // If no reset time in logs, calculate based on frequency
        const daysToAdd = team.frequency && team.frequency.toLowerCase().includes("weekly") ? 7 : 1;
        resetTime = addDays(new Date(), daysToAdd).toISOString();
        timeLeft = daysToAdd === 7 ? "7 days" : "1 day";
      }
      
      return {
        id: team.id,
        name: team.name,
        category: team.category,
        timeLeft: timeLeft,
        resetTime: resetTime,
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
  }, [getProfileDataForMembers]);

  const setupRealtimeSubscription = useCallback((uid: string, teamIds: string[]) => {
    // Unsubscribe from existing channel if any
    if (channel) {
      supabase.removeChannel(channel);
    }
    
    if (teamIds.length === 0) return null;
    
    // Subscribe to changes in team_activity_logs for these teams
    const newChannel = supabase
      .channel('team_activity_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_activity_logs',
        filter: `team_id=in.(${teamIds.join(',')})`,
      }, async () => {
        // When activity logs change, refetch them
        if (uid) {
          await fetchTagTeams(uid);
        }
      })
      .subscribe();
      
    setChannel(newChannel);
    return newChannel;
  }, [channel]);

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

      // Get activity logs for all teams
      const teamIds = teams.map(t => t.id);
      const activityLogs = await getActivityLogsForTeams(teamIds, uid);
      
      // Process teams and set state
      const processedTeams = await processTeams(teams, uid, activityLogs);
      setTagTeams(processedTeams);
      
      // Set up realtime subscription for team activity logs
      setupRealtimeSubscription(uid, teamIds);
      
    } catch (error) {
      console.error("Error processing teams:", error);
      toast.error("Failed to load your TagTeams");
    } finally {
      setLoading(false);
    }
  }, [getActivityLogsForTeams, processTeams, setupRealtimeSubscription]);

  // Handle successful completion
  useEffect(() => {
    const checkForCompletedTeams = () => {
      tagTeams.forEach(team => {
        if (team.isLogged && team.partnerLogged) {
          // Both users have marked each other as completed
          toast.success(`🎉 Congratulations! You and ${team.partnerName} both completed your activities in "${team.name}"!`, {
            duration: 6000
          });
        }
      });
    };
    
    if (tagTeams.length > 0) {
      checkForCompletedTeams();
    }
  }, [tagTeams]);

  // Load on mount or userId change
  useEffect(() => {
    if (userId) {
      fetchTagTeams(userId);
    }
    
    return () => {
      // Cleanup subscription on unmount
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, fetchTagTeams]);

  // External trigger to refresh
  const refetch = () => {
    if (userId) fetchTagTeams(userId);
  };

  return { tagTeams, loading, refetch, setTagTeams };
}
