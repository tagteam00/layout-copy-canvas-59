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
  isLogged?: boolean;
  partnerLogged?: boolean;
}
interface TagTeamListProps {
  teams: TagTeam[];
  onAddTeam?: () => void;
}
export const TagTeamList: React.FC<TagTeamListProps> = ({
  teams,
  onAddTeam
}) => {
  return <section className="flex w-full flex-col text-black mt-5 px-4">
      <div className="flex items-center gap-[9px] text-xs text-black font-normal">
        <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
        <h2 className="whitespace-nowrap">Active tagteams</h2>
        <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
      </div>

      {teams.length === 0 ? <div className="text-center py-8 text-gray-500">
          No active teams. Create your first team!
        </div> : <div className="space-y-4 mt-4 object-scale-down">
          {teams.map(team => <TagTeamCard key={team.id} name={team.name} category={team.category} timeLeft={team.timeLeft} frequency={team.frequency} members={team.members} isLogged={team.isLogged} partnerLogged={team.partnerLogged} />)}
        </div>}

      <AddTeamButton onClick={onAddTeam} />
    </section>;
};