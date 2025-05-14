
import React from "react";
import { TagTeamCard } from "@/components/tagteam/TagTeamCard";
import { TransformedTeam } from "@/types/tagteam";

interface TeamListProps {
  teams: TransformedTeam[];
  onTeamClick: (teamId: string) => void;
}

export const TeamList: React.FC<TeamListProps> = ({ teams, onTeamClick }) => {
  return (
    <div className="space-y-4">
      {teams.map((team) => (
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
