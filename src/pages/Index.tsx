
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { HomeContent } from "@/components/home/HomeContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [tagTeams, setTagTeams] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        
        // Fetch user's teams
        await fetchUserTeams(userData, authData.user?.id || "");
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  const fetchUserTeams = async (userData: any, userId: string) => {
    try {
      if (!userData || !userId) return;
      
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('*')
        .contains('members', [userId]);
        
      if (error) {
        throw error;
      }
      
      // Transform team data for display
      if (teamsData) {
        const transformedTeams = await Promise.all(teamsData.map(async (team) => {
          // Get the partner ID (the other member that is not the current user)
          const partnerId = team.members.find((id: string) => id !== userId);
          
          // Fetch partner profile
          const { data: partnerData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', partnerId)
            .single();
            
          return {
            id: team.id,
            name: team.name,
            firstUser: {
              id: userId,
              name: userData.fullName,
              status: "pending" as const, // For now, hardcoded
              goal: "Will do Push pull legs the entire week, and take as much protien as I can" // Example goal
            },
            secondUser: {
              id: partnerId || "",
              name: partnerData?.full_name || "Partner",
              status: "completed" as const, // For now, hardcoded
              goal: "" // Empty goal for example
            },
            interest: team.category,
            frequency: team.frequency
          };
        }));
        
        setTagTeams(transformedTeams);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleAddTeam = (newTeam: any) => {
    setTagTeams([...tagTeams, newTeam]);
    setIsSheetOpen(false);
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
      />
      <BottomNavigation />
    </main>
  );
};

export default Index;
