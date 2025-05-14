
import React, { useState } from "react";
import { TransformedTeam } from "@/types/tagteam";
import { TagTeamCard } from "@/components/tagteam/TagTeamCard";
import { Button } from "@/components/ui/button";
import { getRemainingTagTeamSlots, MAX_ALLOWED_TAGTEAMS } from "@/utils/teamLimitUtils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TeamListProps {
  teams: TransformedTeam[];
  onTeamClick: (teamId: string) => void;
}

export const TeamList: React.FC<TeamListProps> = ({ teams, onTeamClick }) => {
  const { userProfile } = useUserProfile();
  const [remainingSlots, setRemainingSlots] = useState<number | null>(null);

  useEffect(() => {
    if (userProfile.id) {
      getRemainingTagTeamSlots(userProfile.id).then(slots => {
        setRemainingSlots(slots);
      });
    }
  }, [userProfile.id, teams.length]);

  const sortedTeams = [...teams].sort((a, b) => {
    // Sort by active status first
    if (!a.ended_at && b.ended_at) return -1;
    if (a.ended_at && !b.ended_at) return 1;
    
    // Then sort by creation date (oldest first)
    return new Date(a.id).getTime() - new Date(b.id).getTime();
  });
  
  // Filter for active teams only
  const activeTeams = sortedTeams.filter(team => !team.ended_at);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-500 font-medium">
          Active Teams ({activeTeams.length}/{MAX_ALLOWED_TAGTEAMS})
        </h2>
        
        {remainingSlots !== null && remainingSlots < 2 && (
          <div className="text-xs">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={remainingSlots === 0 ? "bg-amber-100 text-amber-800" : "bg-yellow-100 text-yellow-800"}>
                    {remainingSlots === 0 
                      ? "No slots available" 
                      : `${remainingSlots} slot remaining`}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {remainingSlots === 0 
                      ? "You've reached your limit of 3 active Tag Teams. Complete or leave a team to create a new one."
                      : "Users find focusing on up to 3 partnerships at once leads to better results."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      {activeTeams.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          You don't have any active tag teams yet. Start one!
        </div>
      ) : (
        activeTeams.map((team) => (
          <div 
            key={team.id}
            className="mb-4 relative transform transition-all active:scale-[0.98] cursor-pointer hover:shadow-md"
            onClick={() => onTeamClick(team.id)}
          >
            <TagTeamCard
              name={team.name}
              firstUser={team.firstUser}
              secondUser={team.secondUser}
              interest={team.interest}
              frequency={team.frequency}
              resetDay={team.resetDay}
            />
          </div>
        ))
      )}
      
      {sortedTeams.some(team => team.ended_at) && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h2 className="text-sm text-gray-500 font-medium mb-4">Ended Teams</h2>
          {sortedTeams
            .filter(team => team.ended_at)
            .map((team) => (
              <div
                key={team.id}
                className="mb-4 relative opacity-60 hover:opacity-75 cursor-pointer"
                onClick={() => onTeamClick(team.id)}
              >
                <TagTeamCard
                  name={team.name}
                  firstUser={team.firstUser}
                  secondUser={team.secondUser}
                  interest={team.interest}
                  frequency={team.frequency}
                  resetDay={team.resetDay}
                />
                <div className="absolute inset-0 bg-gray-100 bg-opacity-20 flex items-center justify-center">
                  <span className="text-xs px-2 py-1 bg-gray-800 text-white rounded-md">Ended</span>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};
