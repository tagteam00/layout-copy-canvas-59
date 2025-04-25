
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { HomeContent } from "@/components/home/HomeContent";

const Index: React.FC = () => {
  const { getUserData, getAllUsers } = useUserData();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    username: "",
    interests: [] as string[]
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tagTeams, setTagTeams] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const userData = await getUserData();
        if (userData) {
          setUserProfile({
            fullName: userData.fullName,
            username: userData.username,
            interests: userData.interests
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

  const categories = userProfile.interests;

  const handleAddTeam = newTeam => {
    setTagTeams([...tagTeams, newTeam]);
    setIsSheetOpen(false);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[480px] w-full mx-auto relative pb-20">
      <AppHeader />
      <HomeContent 
        userProfile={userProfile}
        loading={loading}
        tagTeams={tagTeams}
        onAddTeam={() => setIsSheetOpen(true)}
        allUsers={allUsers}
      />
      <BottomNavigation />
      
      <CreateTeamSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        onCreateTeam={handleAddTeam} 
        categories={categories} 
      />
    </main>
  );
};

export default Index;
