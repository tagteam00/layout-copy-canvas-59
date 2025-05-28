
import React from "react";
import { TagTeamCard } from "@/components/tagteam/TagTeamCard";
import { TransformedTeam } from "@/types/tagteam";
import { Badge } from "@/components/ui/badge";

interface TeamListProps {
  teams: TransformedTeam[];
  onTeamClick: (teamId: string) => void;
}

export const TeamList: React.FC<TeamListProps> = ({ teams, onTeamClick }) => {
  // Filter out any teams that have ended before rendering
  const activeTeams = teams.filter(team => !team.ended_at);
  
  if (activeTeams.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        You don't have any active Tag Teams
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeTeams.map((team) => (
        <div key={team.id} onClick={() => onTeamClick(team.id)} className="mb-4">
          <TagTeamCard 
            name={team.name}
            firstUser={team.firstUser}
            secondUser={team.secondUser}
            interest={team.interest}
            frequency={team.frequency}
            resetDay={team.resetDay}
          />
        </div>
      ))}
    </div>
  );
};
