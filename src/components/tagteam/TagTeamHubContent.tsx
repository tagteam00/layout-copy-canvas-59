
import React from "react";
import { TagTeam } from "@/components/home/TagTeamList";
import { TagTeamCard } from "@/components/home/TagTeamCard";

interface TagTeamHubContentProps {
  loading: boolean;
  tagTeams: TagTeam[];
  onTagTeamCardClick: (team: TagTeam) => void;
}

export const TagTeamHubContent: React.FC<TagTeamHubContentProps> = ({
  loading,
  tagTeams,
  onTagTeamCardClick
}) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-100 rounded-xl"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }
  if (tagTeams.length > 0) {
    return (
      <div className="space-y-4">
        {tagTeams.map((team) => (
          <div key={team.id}>
            <TagTeamCard
              {...team}
              onCardClick={() => onTagTeamCardClick(team)}
            />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">No active TagTeams yet</p>
    </div>
  );
};
