
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { TagTeamActivitySheet } from "@/components/tagteam/TagTeamActivitySheet";
import { useTagTeams } from "@/hooks/useTagTeams";
import { TagTeam } from "@/components/home/TagTeamList";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

// Refactored sections
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTagTeams } from "@/components/dashboard/DashboardTagTeams";
import { DashboardUsers } from "@/components/dashboard/DashboardUsers";

const Index: React.FC = () => {
  const { getUserData, getAllUsers } = useUserData();
  const { user } = useAuth();
  const userId = user?.id;

  const [userProfile, setUserProfile] = useState({
    fullName: "",
    username: "",
    interests: [] as string[],
  });

  const [activeTab, setActiveTab] = useState("home");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTagTeam, setSelectedTagTeam] = useState<TagTeam | null>(null);
  
  const { tagTeams, loading: teamLoading, setTagTeams } = useTagTeams(userId);

  // User profile query with caching
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userData', userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getUserData();
    },
    enabled: !!userId,
    staleTime: 60000, // Cache for 1 minute
    onSuccess: (data) => {
      if (data) {
        setUserProfile({
          fullName: data.fullName,
          username: data.username,
          interests: data.interests,
        });
      }
    },
    onError: (error) => {
      console.error("Error loading user data:", error);
      toast.error("Failed to load user profile");
    }
  });

  // All users query with caching
  const { data: allUsers = [], isLoading: allUsersLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: getAllUsers,
    staleTime: 300000, // Cache for 5 minutes
  });

  const handleTagTeamCardClick = (team: TagTeam) => {
    setSelectedTagTeam(team);
  };

  const handleLeaveTagTeam = () => {
    if (selectedTagTeam) {
      setTagTeams(teams => teams.filter(team => team.id !== selectedTagTeam.id));
      setSelectedTagTeam(null);
    }
  };
  
  const handleActivityLogged = (teamId: string, completed: boolean) => {
    setTagTeams(teams => 
      teams.map(team => 
        team.id === teamId 
          ? { ...team, isLogged: completed } 
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

  const loading = userLoading || teamLoading;

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
        <DashboardUsers users={allUsers} loading={allUsersLoading} />
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
      {selectedTagTeam && (
        <TagTeamActivitySheet
          isOpen={!!selectedTagTeam}
          onClose={() => setSelectedTagTeam(null)}
          teamId={selectedTagTeam.id}
          teamName={selectedTagTeam.name}
          partnerId={selectedTagTeam.partnerId || ""}
          partnerName={selectedTagTeam.partnerName}
          onLeaveTeam={handleLeaveTagTeam}
          onActivityLogged={handleActivityLogged}
          isPartnerLogged={selectedTagTeam.partnerLogged}
          resetTime={selectedTagTeam.resetTime}
          frequency={selectedTagTeam.frequency}
        />
      )}
    </main>
  );
};

export default Index;
