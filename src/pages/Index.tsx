
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TagTeamActivitySheet } from "@/components/tagteam/TagTeamActivitySheet";
import { useTagTeams } from "@/hooks/useTagTeams";

// Refactored sections
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTagTeams } from "@/components/dashboard/DashboardTagTeams";
import { DashboardUsers } from "@/components/dashboard/DashboardUsers";

const Index: React.FC = () => {
  const { getUserData, getAllUsers } = useUserData();

  const [userProfile, setUserProfile] = useState({
    fullName: "",
    username: "",
    interests: [] as string[],
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTagTeam, setSelectedTagTeam] = useState<{
    id: string;
    name: string;
    partnerId: string;
  } | null>(null);
  
  // Use the shared hook for TagTeam data
  const { tagTeams, refetch, setTagTeams } = useTagTeams(userId);

  useEffect(() => {
    const loadData = async () => {
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
            username: userData.username,
            interests: userData.interests,
          });
        }

        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Card click handler for TagTeams
  const handleTagTeamCardClick = (team: { id: string; name: string; partnerId: string }) => {
    setSelectedTagTeam(team);
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

  const navItems = [
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
    },
  ];

  const handleAddTeam = () => {
    setIsSheetOpen(true);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userId) {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, refetch]);

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[480px] w-full mx-auto relative pb-20">
      <AppHeader />
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader loading={loading} fullName={userProfile.fullName} interests={userProfile.interests} />
        <DashboardTagTeams
          tagTeams={tagTeams}
          onAddTeam={handleAddTeam}
          userName={userProfile.fullName}
          onTagTeamClick={handleTagTeamCardClick}
        />
        <DashboardUsers users={allUsers} loading={loading} />
      </div>
      <BottomNavigation items={navItems} />
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
        teamId={selectedTagTeam?.id || ""}
        teamName={selectedTagTeam?.name || ""}
        partnerId={selectedTagTeam?.partnerId || ""}
        onLeaveTeam={handleLeaveTagTeam}
        onActivityLogged={handleActivityLogged}
      />
    </main>
  );
};

export default Index;
