import React from "react";
import { TagTeamCard } from "./TagTeamCard";
import { AddTeamButton } from "./AddTeamButton";
import { Button } from "../ui/button";
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
  userName?: string;
}
export const TagTeamList: React.FC<TagTeamListProps> = ({
  teams,
  onAddTeam,
  userName = ""
}) => {
  return <section className="flex w-full flex-col text-black mt-5 px-4">
      <div className="flex items-center gap-[9px] text-xs text-black font-normal py-[7px]">
        <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
        <h2 className="whitespace-nowrap text-xs">Active tagteams</h2>
        <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
      </div>

      {teams.length === 0 ? <div className="flex flex-col items-center justify-center text-gray-500 w-full space-y-5 py-0">
          <img alt="No tagteams yet" style={{
        width: 152,
        height: 145
      }} draggable={false} src="/lovable-uploads/28c79c00-3c56-4b4b-8826-f2994012edf6.png" className="mx-auto mb-2 object-scale-down" />
          <div style={{
        fontFamily: "Hanken Grotesk, sans-serif"
      }} className="text-base text-gray-700 text-center mt-2 mb-2 px-4 my-px py-[12px]">
            {userName ? `${userName} people are out-there to team up with you` : `People are out-there to team up with you`}
          </div>
          <Button style={{
        marginLeft: 16,
        marginRight: 16,
        height: 56,
        fontSize: 18
      }} onClick={onAddTeam} size="lg" className="w-full max-w-[448px] mx-4 mt-0 text-base font-semibold bg-black text-white rounded-xl py-[8px]">
            Start your first tagteam
          </Button>
        </div> : <div className="space-y-4 mt-4">
          {teams.map(team => <TagTeamCard key={team.id} name={team.name} category={team.category} timeLeft={team.timeLeft} frequency={team.frequency} members={team.members} isLogged={team.isLogged} partnerLogged={team.partnerLogged} />)}
        </div>}

      {teams.length > 0 && <AddTeamButton onClick={onAddTeam} />}
    </section>;
};