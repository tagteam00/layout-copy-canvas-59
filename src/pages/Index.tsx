
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { HomeContent } from "@/components/home/HomeContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTeamData } from "@/hooks/useTeamData";

const Index: React.FC = () => {
  const { getUserData, getAllUsers } = useUserData();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    username: "",
    interests: [] as string[],
    id: ""
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Use the same team data hook that's used in TagTeamHub
  const { tagTeams, fetchUserTeams, refreshTeams, hasReachedTeamLimit } = useTeamData(
    userProfile.id, 
    userProfile.fullName
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userData = await getUserData();
        
        if (userData) {
          setUserProfile({
            fullName: userData.fullName,
            username: userData.username,
            interests: userData.interests,
            id: authData.user?.id || ""
          });
        }
        
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  // When user profile ID is available, fetch the teams
  useEffect(() => {
    if (userProfile.id) {
      fetchUserTeams();
    }
  }, [userProfile.id]);

  const handleAddTeam = async () => {
    setIsSheetOpen(false);
    if (userProfile.id) {
      await refreshTeams();
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white w-full mx-auto relative pb-16">
      <AppHeader />
      <div className="max-w-[480px] w-full mx-auto px-4">
        <HomeContent 
          userProfile={userProfile}
          loading={loading}
          tagTeams={tagTeams}
          onAddTeam={() => setIsSheetOpen(true)}
          allUsers={allUsers}
        />
      </div>
      
      <CreateTeamSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        onCreateTeam={handleAddTeam} 
        categories={userProfile.interests}
        hasReachedTeamLimit={hasReachedTeamLimit?.() || false} 
      />
      <BottomNavigation />
    </main>
  );
};

export default Index;
