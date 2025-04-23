
import React from "react";
import { TagTeamList, TagTeam } from "@/components/home/TagTeamList";

interface DashboardTagTeamsProps {
  tagTeams: TagTeam[];
  onAddTeam: () => void;
  userName: string;
  onTagTeamClick: (team: { id: string; name: string; partnerId: string }) => void;
}

export const DashboardTagTeams: React.FC<DashboardTagTeamsProps> = ({
  tagTeams,
  onAddTeam,
  userName,
  onTagTeamClick
}) => (
  <TagTeamList
    teams={tagTeams}
    onAddTeam={onAddTeam}
    userName={userName}
    onTagTeamClick={onTagTeamClick}
  />
);
