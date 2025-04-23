import React from "react";
import { Input } from "@/components/ui/input";
interface NameStepProps {
  teamName: string;
  setTeamName: (name: string) => void;
}
export const NameStep: React.FC<NameStepProps> = ({
  teamName,
  setTeamName
}) => {
  return <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Team Name</label>
        <Input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Name your TagTeam" required className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl py-0 my-[8px]" />
      </div>
    </div>;
};