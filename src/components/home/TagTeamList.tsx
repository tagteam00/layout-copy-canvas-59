import React from "react";
import { TagTeamCard } from "./TagTeamCard";
import { AddTeamButton } from "./AddTeamButton";

interface TagTeam {
  id: string;
  name: string;
  category: string;
  timeLeft: string;
  frequency: string;
  members: string;
}

interface TagTeamListProps {
  teams: TagTeam[];
  onAddTeam?: () => void;
}

export const TagTeamList: React.FC<TagTeamListProps> = ({
  teams,
  onAddTeam,
}) => {
  const handleAddTeam = () => {
    if (onAddTeam) {
      onAddTeam();
    }
  };

  return (
    <section className="flex w-full flex-col text-black leading-none mt-5 px-[15px]">
      <div className="flex items-center gap-[9px] text-xs text-black font-normal leading-none">
        <div className="border self-stretch w-[133px] shrink-0 h-px my-auto border-[rgba(0,0,0,0.5)] border-solid" />
        <h2 className="self-stretch">Active tagteams</h2>
        <div className="border self-stretch w-[133px] shrink-0 h-px my-auto border-[rgba(0,0,0,0.5)] border-solid" />
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No active teams. Create your first team!
        </div>
      ) : (
        teams.map((team) => (
          <TagTeamCard
            key={team.id}
            name={team.name}
            category={team.category}
            timeLeft={team.timeLeft}
            frequency={team.frequency}
            members={team.members}
          />
        ))
      )}

      <AddTeamButton onClick={handleAddTeam} />
    </section>
  );
};
