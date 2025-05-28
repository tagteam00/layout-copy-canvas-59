
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoSectionProps {
  fullName: string;
  username: string;
  city: string;
  country: string;
  occupation: string;
  onInputChange: (field: string, value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  fullName,
  username,
  city,
  country,
  occupation,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Full Name</Label>
        <Input
          value={fullName}
          onChange={(e) => onInputChange("fullName", e.target.value)}
          placeholder="Enter your full name"
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Username</Label>
        <Input
          value={username}
          onChange={(e) => onInputChange("username", e.target.value)}
          placeholder="Enter your username"
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">City</Label>
        <Input
          value={city}
          onChange={(e) => onInputChange("city", e.target.value)}
          placeholder="Enter your city"
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        <p className="text-xs text-gray-500 mt-1">
          Note: Location was selected using map during onboarding. You can update it here manually.
        </p>
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Country</Label>
        <Input
          value={country}
          onChange={(e) => onInputChange("country", e.target.value)}
          placeholder="Enter your country"
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Occupation</Label>
        <Input
          value={occupation}
          onChange={(e) => onInputChange("occupation", e.target.value)}
          placeholder="Enter your occupation"
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
      </div>
    </div>
  );
};
