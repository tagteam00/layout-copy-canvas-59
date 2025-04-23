import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TagTeam } from "@/components/home/TagTeamList";
import { RealtimeChannel } from "@supabase/supabase-js";
import { addDays, isAfter } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useTagTeams(userId: string | null) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const queryClient = useQueryClient();
  
  // Profile cache to avoid redundant profile fetches
  const profileCache = useMemo(() => new Map<string, any>(), []);

  // Reuse profile data between calls using memoized function
  const getProfileDataForMembers = useCallback(async (memberIds: string[]) => {
    try {
      // Filter out IDs we already have in cache
      const uncachedIds = memberIds.filter(id => !profileCache.has(id));
      
      if (uncachedIds.length > 0) {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", uncachedIds);
          
        if (error) {
          console.error("Error fetching team member profiles:", error);
        } else if (profiles) {
          // Update cache with new profiles
          profiles.forEach(profile => profileCache.set(profile.id, profile));
        }
      }
      
      // Return profiles from cache
      return memberIds.map(id => 
        profileCache.get(id) || { id, full_name: "Team Member" }
      );
    } catch (error) {
      console.error("Error in getProfileDataForMembers:", error);
      return memberIds.map(() => ({ full_name: "Team Member" }));
    }
  }, [profileCache]);

  // Fetch activity logs for teams with improved error handling
  const getActivityLogsForTeams = useCallback(async (teamIds: string[], currentUserId: string) => {
    if (!teamIds.length || !currentUserId) return {};
    
    try {
      const { data: logs, error } = await supabase
        .from('team_activity_logs')
        .select('*')
        .in('team_id', teamIds)
        .or(`user_id.eq.${currentUserId},partner_id.eq.${currentUserId}`);
      
      if (error) {
        console.error("Error fetching activity logs:", error);
        return {};
      }

      console.log("Fetched activity logs:", logs);

      // Group logs by team_id with improved status tracking
      const teamLogs: Record<string, {
        isLogged: boolean,
        partnerLogged: boolean,
        resetTime?: string
      }> = {};
      
      teamIds.forEach(id => {
        teamLogs[id] = {
          isLogged: false,
          partnerLogged: false,
          resetTime: undefined
        };
      });

      logs?.forEach(log => {
        if (log.team_id) {
          const isUserLog = log.user_id === currentUserId;
          const isPartnerLog = log.partner_id === currentUserId;

          if (isUserLog) {
            // This is a log I created for my partner
            teamLogs[log.team_id].isLogged = log.completed;
          } else if (isPartnerLog) {
            // This is a log my partner created for me
            teamLogs[log.team_id].partnerLogged = log.completed;
          }
          
          // Update reset time if newer
          if (log.period_end && (!teamLogs[log.team_id].resetTime || 
              new Date(log.period_end) > new Date(teamLogs[log.team_id].resetTime!))) {
            teamLogs[log.team_id].resetTime = log.period_end;
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

  // Process teams with member data and activity logs
  const processTeams = useCallback(async (teams: any[], uid: string, activityLogs: any) => {
    if (!teams.length || !uid) return [];
    
    // Get all unique member IDs across teams
    const allMemberIds = Array.from(new Set(
      teams.flatMap(team => team.members || [])
    ));
    
    // Fetch all member profiles in one go
    const memberProfiles = await getProfileDataForMembers(allMemberIds);
    const membersById = Object.fromEntries(
      memberProfiles.map(profile => [profile.id, profile])
    );
    
    return teams.map(team => {
      const [memberA, memberB] = team.members || [];
      const partnerId = memberA === uid ? memberB : memberA;

      // Get member names from the pre-fetched profiles
      const myProfile = membersById[uid] || { full_name: "Me" };
      const partnerProfile = membersById[partnerId] || { full_name: "Partner" };
      
      // Make sure current user is always first in the array
      let memberNames: [string, string] = ["", ""];
      let memberAvatars: [string | null, string | null] = [null, null];
      
      if (team.members.indexOf(uid) === 0) {
        memberNames = [myProfile.full_name || "Me", partnerProfile.full_name || "Partner"] as [string, string];
      } else {
        memberNames = [myProfile.full_name || "Me", partnerProfile.full_name || "Partner"] as [string, string];
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
        partnerName: partnerProfile?.full_name || "Partner",
        isLogged: teamActivity.isLogged,
        partnerLogged: teamActivity.partnerLogged,
        memberNames,
        memberAvatars,
        memberInitials,
      };
    });
  }, [getProfileDataForMembers]);

  // Improved real-time subscription setup
  const setupRealtimeSubscription = useCallback((uid: string, teamIds: string[]) => {
    if (!uid || teamIds.length === 0) return null;
    
    // Unsubscribe from existing channel if any
    if (channel) {
      console.log("Removing existing channel");
      supabase.removeChannel(channel);
    }
    
    console.log("Setting up real-time subscription for teams:", teamIds);
    
    // Create new channel with both user_id and partner_id filters
    const newChannel = supabase
      .channel(`team_activity_${uid}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_activity_logs',
        filter: `team_id=in.(${teamIds.join(',')})`,
      }, (payload) => {
        console.log("Received real-time update:", payload);
        queryClient.invalidateQueries({ queryKey: ['tagTeams', uid] });
      })
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });
      
    setChannel(newChannel);
    return newChannel;
  }, [channel, queryClient]);

  // Main query with improved error handling and logging
  const { data: tagTeams = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['tagTeams', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        console.log("Fetching teams for user:", userId);
        
        const { data: teams, error } = await supabase
          .from('teams')
          .select('*')
          .contains('members', [userId]);
        
        if (error) {
          console.error("Error fetching teams:", error);
          throw error;
        }

        if (!teams || teams.length === 0) {
          console.log("No teams found");
          return [];
        }

        // Get activity logs for all teams
        const teamIds = teams.map(t => t.id);
        const activityLogs = await getActivityLogsForTeams(teamIds, userId);
        
        // Process teams and set up real-time subscription
        const processedTeams = await processTeams(teams, userId, activityLogs);
        
        setupRealtimeSubscription(userId, teamIds);
        
        return processedTeams;
      } catch (error) {
        console.error("Error processing teams:", error);
        toast.error("Failed to load your TagTeams");
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 30000,
    retry: 2,
  });

  // Handle congratulations message on success
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

  // Clean up subscription on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        console.log("Cleaning up real-time subscription");
        supabase.removeChannel(channel);
      }
    };
  }, [channel]);

  const manualRefetch = () => {
    if (userId) {
      console.log("Manually refetching teams");
      refetch();
    }
  };

  const setTagTeams = useCallback((updaterFn: (prev: TagTeam[]) => TagTeam[]) => {
    queryClient.setQueryData(['tagTeams', userId], (oldData: TagTeam[] = []) => {
      const newData = updaterFn(oldData);
      console.log("Updating TagTeams cache:", newData);
      return newData;
    });
  }, [queryClient, userId]);

  return { 
    tagTeams, 
    loading, 
    refetch: manualRefetch, 
    setTagTeams 
  };
}
