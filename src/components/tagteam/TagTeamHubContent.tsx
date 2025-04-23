
import React, { memo } from "react";
import { TagTeam } from "@/components/home/TagTeamList";
import { TagTeamCard } from "@/components/home/TagTeamCard";
import { Skeleton } from "@/components/ui/skeleton";

interface TagTeamHubContentProps {
  loading: boolean;
  tagTeams: TagTeam[];
  onTagTeamCardClick: (team: TagTeam) => void;
}

export const TagTeamHubContent: React.FC<TagTeamHubContentProps> = memo(({
  loading,
  tagTeams,
  onTagTeamCardClick
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
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
});

TagTeamHubContent.displayName = "TagTeamHubContent";
