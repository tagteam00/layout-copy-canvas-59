
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AddTeamButton } from "@/components/home/AddTeamButton";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { TagTeamSheet } from "@/components/tagteam/TagTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { EmptyTeamState } from "@/components/tagteam/hub/EmptyTeamState";
import { TeamList } from "@/components/tagteam/hub/TeamList";
import { useTeamData } from "@/hooks/useTeamData";
import { TransformedTeam } from "@/types/tagteam";
import { supabase } from "@/integrations/supabase/client";

const TagTeamHub: React.FC = () => {
  const { getUserData } = useUserData();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    interests: [] as string[],
    id: ""
  });
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isTagTeamSheetOpen, setIsTagTeamSheetOpen] = useState(false);
  const [selectedTagTeam, setSelectedTagTeam] = useState<TransformedTeam | null>(null);
  
  // Initialize the team data hook with empty values until user profile is loaded
  const { tagTeams, loading, fetchUserTeams, refreshTeams } = useTeamData(
    userProfile.id, 
    userProfile.fullName
  );

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          const { data: authData } = await supabase.auth.getUser();
          
          setUserProfile({
            fullName: userData.fullName,
            interests: userData.interests || [],
            id: authData.user?.id || ""
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Once we have the user profile, fetch the teams
  useEffect(() => {
    if (userProfile.id) {
      fetchUserTeams();
    }
  }, [userProfile.id]);

  const handleLogActivity = (teamId: string) => {
    const team = tagTeams.find(team => team.id === teamId);
    if (team) {
      setSelectedTagTeam(team);
      setIsTagTeamSheetOpen(true);
    }
  };

  const handleAddTeam = (newTeam: any) => {
    refreshTeams();
    setIsSheetOpen(false);
  };

  // Handler for when a team is left to refresh the list immediately
  const handleTagTeamClosed = async () => {
    setIsTagTeamSheetOpen(false);
    if (userProfile.id) {
      await refreshTeams();
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white w-full mx-auto relative pb-16">
      <AppHeader />
      <div className="max-w-[480px] w-full mx-auto px-4">
        <h1 className="mb-6 font-extrabold text-lg pt-4">Tagteam Hub</h1>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Loading your tagteams...</div>
          </div>
        ) : tagTeams.length > 0 ? (
          <TeamList teams={tagTeams} onTeamClick={handleLogActivity} />
        ) : (
          <EmptyTeamState />
        )}
      </div>

      <AddTeamButton onClick={() => setIsSheetOpen(true)} />
      
      <CreateTeamSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        onCreateTeam={handleAddTeam} 
        categories={userProfile.interests} 
      />
      
      {selectedTagTeam && (
        <TagTeamSheet 
          isOpen={isTagTeamSheetOpen}
          onClose={handleTagTeamClosed}
          tagTeam={selectedTagTeam}
          currentUserId={userProfile.id}
        />
      )}
      
      <BottomNavigation />
    </main>
  );
};

export default TagTeamHub;
