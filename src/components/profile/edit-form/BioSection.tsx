
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioSectionProps {
  bio: string;
  onInputChange: (field: string, value: string) => void;
}

export const BioSection: React.FC<BioSectionProps> = ({ bio, onInputChange }) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Bio</Label>
      <Textarea
        value={bio}
        onChange={(e) => onInputChange("bio", e.target.value)}
        placeholder="Tell us about yourself"
        rows={4}
        className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
      />
    </div>
  );
};
