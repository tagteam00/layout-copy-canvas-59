
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSanitizedInput } from "@/utils/sanitization";

interface NameStepProps {
  teamName: string;
  setTeamName: (name: string) => void;
}

export const NameStep: React.FC<NameStepProps> = ({
  teamName,
  setTeamName
}) => {
  const { sanitizeText } = useSanitizedInput();
  return (
    <div className="space-y-4">
      <div className="form-group">
        <Label htmlFor="teamName" className="block text-sm font-medium mb-1.5">Team Name</Label>
        <Input 
          id="teamName"
          type="text" 
          value={teamName} 
          onChange={e => setTeamName(sanitizeText(e.target.value))} 
          placeholder="Name your TagTeam" 
          required 
          className="w-full rounded-xl py-2.5 px-4 border border-[rgba(130,122,255,0.41)]" 
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Choose a name that represents your shared goal
        </p>
      </div>
    </div>
  );
};
