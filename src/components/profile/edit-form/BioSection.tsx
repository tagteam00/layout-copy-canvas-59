
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioSectionProps {
  bio: string;
  onInputChange: (field: string, value: string) => void;
}

export const BioSection: React.FC<BioSectionProps> = ({ bio, onInputChange }) => {
  const MAX_CHARS = 180;
  const remainingChars = MAX_CHARS - (bio?.length || 0);
  
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      onInputChange("bio", value);
    }
  };
  
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Bio</Label>
      <Textarea
        value={bio}
        onChange={handleBioChange}
        placeholder="Tell us about yourself"
        rows={4}
        maxLength={MAX_CHARS}
        className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
      />
      <p className={`text-xs mt-1 text-right ${remainingChars < 20 ? 'text-amber-600' : 'text-gray-500'}`}>
        {remainingChars} characters remaining
      </p>
    </div>
  );
};
