
import React, { useState } from "react";
import { Button } from "../ui/button";
import { TagTeamCard } from "../tagteam/TagTeamCard";
import { TagTeamSheet } from "../tagteam/TagTeamSheet";
import { TagTeam } from "@/types/tagteam";

interface TagTeamListProps {
  teams: TagTeam[];
  onAddTeam?: () => void;
  userName?: string;
  loading?: boolean;
  currentUserId?: string;
}

export const TagTeamList: React.FC<TagTeamListProps> = ({
  teams,
  onAddTeam,
  userName = "",
  loading = false,
  currentUserId = ""
}) => {
  const [isTagTeamSheetOpen, setIsTagTeamSheetOpen] = useState(false);
  const [selectedTagTeam, setSelectedTagTeam] = useState<TagTeam | null>(null);

  // Filter out any ended teams before rendering
  const activeTeams = teams.filter(team => !team.ended_at);

  const handleCardClick = (team: TagTeam) => {
    setSelectedTagTeam(team);
    setIsTagTeamSheetOpen(true);
  };

  if (loading) {
    return (
      <section className="flex w-full flex-col text-black mt-5 my-0">
        <div className="animate-pulse text-center py-8">Loading your tagteams...</div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col text-black mt-5 my-0">
      <div className="flex items-center gap-[9px] text-xs text-black font-normal py-0 my-0">
        <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
        <h2 className="whitespace-nowrap text-xs text-[#707070]">Active tagteams</h2>
        <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
      </div>

      {activeTeams.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 w-full space-y-5 py-0 my-[8px]">
          <img
            alt="No tagteams yet"
            style={{
              width: 152,
              height: 145
            }}
            draggable={false}
            src="/lovable-uploads/28c79c00-3c56-4b4b-8826-f2994012edf6.png"
            className="mx-auto mb-2 object-scale-down"
          />
          <div
            style={{
              fontFamily: "Hanken Grotesk, sans-serif"
            }}
            className="text-base text-gray-700 text-center mt-2 mb-2 px-4 py-0 my-[4px]"
          >
            {userName
              ? `${userName}, people are out-there to team up with you`
              : `People are out-there to team up with you`}
          </div>
          <Button
            style={{
              height: 56,
              fontSize: 18
            }}
            onClick={onAddTeam}
            size="lg"
            className="w-full max-w-[448px] mt-0 text-base font-semibold bg-black text-white rounded-xl py-0 my-[8px]"
          >
            Start your first tagteam
          </Button>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {activeTeams.map((team) => (
            <div 
              key={team.id} 
              className="mb-4 relative transform transition-all active:scale-[0.98] cursor-pointer hover:shadow-md"
              onClick={() => handleCardClick(team)}
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
          ))}
        </div>
      )}

      {selectedTagTeam && (
        <TagTeamSheet
          isOpen={isTagTeamSheetOpen}
          onClose={() => setIsTagTeamSheetOpen(false)}
          tagTeam={selectedTagTeam}
          currentUserId={currentUserId || ""}
        />
      )}
    </section>
  );
};
