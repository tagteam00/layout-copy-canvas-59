
import { useEffect, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TagTeam } from "@/components/home/TagTeamList";
import { useUserData } from "@/hooks/useUserData";

// Wraps tag teams fetching + user profile logic
export function useTagTeams() {
  const { getUserData } = useUserData();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    interests: [] as string[],
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tagTeams, setTagTeams] = useState<TagTeam[]>([]);

  // Fetch teams for a userId
  const fetchTagTeams = useCallback(
    async (userId: string) => {
      try {
        const { data: teams, error } = await supabase
          .from('teams')
          .select('*')
          .contains('members', [userId]);

        if (error) {
          console.error("Error fetching teams:", error);
          return;
        }

        const processedTeams = await Promise.all(
          (teams || []).map(async (team) => {
            const partnerId = team.members.find((member: string) => member !== userId);
            let partnerName = "Team Member";
            if (partnerId) {
              const { data: partner } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', partnerId)
                .single();

              if (partner) {
                partnerName = partner.full_name;
              }
            }

            let timeLeft = "1 day";
            if (team.frequency.includes("Weekly")) {
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
              partnerName: partnerName,
              isLogged: false,
              partnerLogged: false
            };
          })
        );
        setTagTeams(processedTeams);
      } catch (error) {
        console.error("Error processing teams:", error);
        toast.error("Failed to load your TagTeams");
      }
    },
    []
  );

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }

        const userData = await getUserData();
        if (userData) {
          setUserProfile({
            fullName: userData.fullName,
            interests: userData.interests,
          });
        }

        if (user) {
          await fetchTagTeams(user.id);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [getUserData, fetchTagTeams]);

  // Refetch on visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userId) {
        fetchTagTeams(userId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [userId, fetchTagTeams]);

  const addTagTeam = (newTeam: TagTeam) => {
    setTagTeams((prev) => [...prev, newTeam]);
  };
  const removeTagTeam = (id: string) => {
    setTagTeams((prev) => prev.filter(team => team.id !== id));
  };

  return {
    userProfile,
    userId,
    loading,
    tagTeams,
    fetchTagTeams,
    addTagTeam,
    removeTagTeam,
    setTagTeams
  };
}
