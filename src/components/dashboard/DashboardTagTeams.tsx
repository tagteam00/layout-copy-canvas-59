
import React from "react";
import { TagTeamList, TagTeam } from "@/components/home/TagTeamList";

interface DashboardTagTeamsProps {
  tagTeams: TagTeam[];
  onAddTeam: () => void;
  userName: string;
  onTagTeamClick: (team: TagTeam) => void;  // Updated to accept full TagTeam object
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
