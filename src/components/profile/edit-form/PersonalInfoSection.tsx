
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface PersonalInfoSectionProps {
  fullName: string;
  username: string;
  city: string;
  country: string;
  occupation: string;
  fullAddress?: string;
  
  onInputChange: (field: string, value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  fullName,
  username,
  city,
  country,
  occupation,
  fullAddress,
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
      
      {/* Location Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium mb-2 block flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          Location
        </Label>
        
        {fullAddress && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600">{fullAddress}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">City</Label>
            <Input
              value={city}
              onChange={(e) => onInputChange("city", e.target.value)}
              placeholder="Enter your city"
              className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Country</Label>
            <Input
              value={country}
              onChange={(e) => onInputChange("country", e.target.value)}
              placeholder="Enter your country"
              className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
            />
          </div>
        </div>
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
