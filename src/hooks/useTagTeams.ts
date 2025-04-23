
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

      const processedTeams = await Promise.all((teams || []).map(async (team: any) => {
        const [memberA, memberB] = team.members;
        const partnerId = memberA === uid ? memberB : memberA;

        // Fetch both members' profiles
        const memberProfiles = await getProfileDataForMembers([memberA, memberB]);
        const memberNames = memberProfiles.map((profile) => profile.full_name || "Team Member") as [string, string];
        const memberAvatars: [string | null, string | null] = [null, null];
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
        return {
          id: team.id,
          name: team.name,
          category: team.category,
          timeLeft: timeLeft,
          frequency: team.frequency,
          members: team.members,
          partnerId: partnerId,
          partnerName: memberProfiles[team.members.indexOf(partnerId)]?.full_name || "Team Member",
          isLogged: false,
          partnerLogged: false,
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
  }, [getProfileDataForMembers]);

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

