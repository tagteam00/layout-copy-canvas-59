
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AddTeamButton } from "@/components/home/AddTeamButton";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { HubContainer } from "@/components/tagteam/hub/HubContainer";
import { TagTeamHeader } from "@/components/tagteam/hub/TagTeamHeader";
import { LoadingState } from "@/components/tagteam/hub/LoadingState";
import { EmptyTeamState } from "@/components/tagteam/hub/EmptyTeamState";
import { TeamList } from "@/components/tagteam/hub/TeamList";
import { TagTeamSheetWrapper } from "@/components/tagteam/hub/TagTeamSheetWrapper";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTeamData } from "@/hooks/useTeamData";
import { TransformedTeam } from "@/types/tagteam";

const TagTeamHub: React.FC = () => {
  const { userProfile } = useUserProfile();
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isTagTeamSheetOpen, setIsTagTeamSheetOpen] = useState(false);
  const [selectedTagTeam, setSelectedTagTeam] = useState<TransformedTeam | null>(null);
  
  // Initialize team data hook with user profile info
  const { tagTeams, loading, fetchUserTeams, refreshTeams } = useTeamData(
    userProfile.id, 
    userProfile.fullName
  );

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

  const handleAddTeam = () => {
    refreshTeams();
    setIsSheetOpen(false);
  };

  const handleTagTeamClosed = async () => {
    setIsTagTeamSheetOpen(false);
    if (userProfile.id) {
      await refreshTeams();
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white w-full mx-auto relative pb-16">
      <AppHeader />
      <HubContainer>
        <TagTeamHeader title="Tagteam Hub" />
        
        {loading ? (
          <LoadingState />
        ) : tagTeams.length > 0 ? (
          <TeamList teams={tagTeams} onTeamClick={handleLogActivity} />
        ) : (
          <EmptyTeamState />
        )}
      </HubContainer>

      <AddTeamButton onClick={() => setIsSheetOpen(true)} />
      
      <CreateTeamSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        onCreateTeam={handleAddTeam} 
        categories={userProfile.interests} 
      />
      
      <TagTeamSheetWrapper 
        isOpen={isTagTeamSheetOpen}
        onClose={handleTagTeamClosed}
        selectedTagTeam={selectedTagTeam}
        currentUserId={userProfile.id}
      />
      
      <BottomNavigation />
    </main>
  );
};

export default TagTeamHub;
