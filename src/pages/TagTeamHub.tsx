
import React, { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AddTeamButton } from "@/components/home/AddTeamButton";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { toast } from "sonner";
import { TagTeamActivitySheet } from "@/components/tagteam/TagTeamActivitySheet";
import { useTagTeams } from "@/hooks/useTagTeams";
import { TagTeam } from "@/components/home/TagTeamList";
import { tagteamNavItems } from "@/components/tagteam/tagteamNavItems";
import { TagTeamHubContent } from "@/components/tagteam/TagTeamHubContent";

const TagTeamHub: React.FC = () => {
  const {
    userProfile,
    userId,
    loading,
    tagTeams,
    addTagTeam,
    removeTagTeam
  } = useTagTeams();

  const [activeTab, setActiveTab] = useState("tagteam");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTagTeam, setSelectedTagTeam] = useState<{
    id: string;
    name: string;
    partnerId: string;
  } | null>(null);

  // Handle when user taps on a card
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

  // When a new team is added, add to state and close sheet
  const handleAddTeam = (newTeam: TagTeam) => {
    addTagTeam(newTeam);
    setIsSheetOpen(false);
  };

  // When leaving a team, remove it from state
  const handleLeaveTagTeam = () => {
    if (selectedTagTeam && selectedTagTeam.id) {
      removeTagTeam(selectedTagTeam.id);
    }
    setSelectedTagTeam(null);
  };

  // Create nav items with activeTab state injected
  const navItems = tagteamNavItems.map(item => ({
    ...item,
    isActive: typeof item.isActive === "function" ? item.isActive(activeTab) : item.isActive
  }));

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
        <TagTeamHubContent
          loading={loading}
          tagTeams={tagTeams}
          onTagTeamCardClick={handleTagTeamCardClick}
        />
      </div>

      <BottomNavigation items={navItems} />

      <AddTeamButton onClick={() => setIsSheetOpen(true)} />

      <CreateTeamSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreateTeam={handleAddTeam}
        categories={userProfile.interests}
      />

      <TagTeamActivitySheet
        isOpen={!!selectedTagTeam}
        onClose={() => setSelectedTagTeam(null)}
        teamId={selectedTagTeam?.id || ''}
        teamName={selectedTagTeam?.name || ''}
        partnerId={selectedTagTeam?.partnerId || ''}
        onLeaveTeam={handleLeaveTagTeam}
      />
    </main>
  );
};

export default TagTeamHub;
