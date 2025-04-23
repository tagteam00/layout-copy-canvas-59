
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { TagTeamCard } from "@/components/home/TagTeamCard";
import { AddTeamButton } from "@/components/home/AddTeamButton";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TagTeam } from "@/components/home/TagTeamList";
import { TagTeamActivitySheet } from "@/components/tagteam/TagTeamActivitySheet";
import { useTagTeams } from "@/hooks/useTagTeams";

const TagTeamHub: React.FC = () => {
  const { getUserData } = useUserData();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    interests: [] as string[],
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tagteam");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTagTeam, setSelectedTagTeam] = useState<{
    id: string;
    name: string;
    partnerId: string;
  } | null>(null);

  const { tagTeams, loading, refetch, setTagTeams } = useTagTeams(userId);

  useEffect(() => {
    const loadUserData = async () => {
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
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user profile");
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userId) {
        refetch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, refetch]);

  const handleTagTeamCardClick = (team: TagTeam) => {
    if (team.id && team.partnerId) {
      setSelectedTagTeam({
        id: team.id,
        name: team.name,
        partnerId: team.partnerId
      });
    } else {
      toast.error("Cannot open this team. Missing team or partner information.");
    }
  };

  const handleLeaveTagTeam = () => {
    setTagTeams(teams => teams.filter(team => team.id !== selectedTagTeam?.id));
    setSelectedTagTeam(null);
  };
  
  const handleActivityLogged = (teamId: string, completed: boolean) => {
    setTagTeams(teams => 
      teams.map(team => 
        team.id === teamId 
          ? { ...team, partnerLogged: completed } 
          : team
      )
    );
  };

  return (
    <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto pb-20">
      <AppHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">TagTeam Hub</h1>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Track and manage all your active TagTeams
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-100 rounded-xl"></div>
            <div className="h-32 bg-gray-100 rounded-xl"></div>
          </div>
        ) : tagTeams.length > 0 ? (
          <div className="space-y-4">
            {tagTeams.map((team) => (
              <div key={team.id}>
                <TagTeamCard
                  id={team.id}
                  name={team.name}
                  category={team.category}
                  timeLeft={team.timeLeft}
                  frequency={team.frequency}
                  members={team.members}
                  memberNames={team.memberNames}
                  memberAvatars={team.memberAvatars}
                  memberInitials={team.memberInitials}
                  isLogged={team.isLogged}
                  partnerLogged={team.partnerLogged}
                  partnerId={team.partnerId}
                  partnerName={team.partnerName}
                  onCardClick={() => handleTagTeamCardClick(team)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No active TagTeams yet</p>
          </div>
        )}
      </div>

      <BottomNavigation items={[
        {
          name: "Home",
          icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/c761f5256fcea0afdf72f5aa0ab3d05e40a3545b?placeholderIfAbsent=true",
          path: "/",
          isActive: activeTab === "home",
        },
        {
          name: "Tagteam",
          icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/99b9d22862884f6e83475b74fa086fd10fb5e57f?placeholderIfAbsent=true",
          path: "/tagteam",
          isActive: activeTab === "tagteam",
        },
        {
          name: "Profile",
          icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/6015a6ceb8f49982ed2ff6177f7ee6374f72c48d?placeholderIfAbsent=true",
          path: "/profile",
          isActive: activeTab === "profile",
        }]}
      />
      
      <AddTeamButton onClick={() => setIsSheetOpen(true)} />

      <CreateTeamSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreateTeam={(newTeam) => {
          setTagTeams([...tagTeams, newTeam]);
          setIsSheetOpen(false);
        }}
        categories={userProfile.interests}
      />

      <TagTeamActivitySheet
        isOpen={!!selectedTagTeam}
        onClose={() => setSelectedTagTeam(null)}
        teamId={selectedTagTeam?.id || ''}
        teamName={selectedTagTeam?.name || ''}
        partnerId={selectedTagTeam?.partnerId || ''}
        onLeaveTeam={handleLeaveTagTeam}
        onActivityLogged={handleActivityLogged}
      />
    </main>
  );
};

export default TagTeamHub;
