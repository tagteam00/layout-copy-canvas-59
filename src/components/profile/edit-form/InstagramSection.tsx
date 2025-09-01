import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Instagram } from "lucide-react";

interface InstagramSectionProps {
  instagramHandle: string;
  onInputChange: (field: string, value: string) => void;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  instagramHandle,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Instagram className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instagramHandle" className="text-sm font-medium text-gray-700">
          Instagram Handle
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            @
          </span>
          <Input
            id="instagramHandle"
            type="text"
            placeholder="username"
            value={instagramHandle}
            onChange={(e) => onInputChange("instagramHandle", e.target.value)}
            className="pl-8"
          />
        </div>
        <p className="text-xs text-gray-500">
          Share your Instagram with your TagTeam partners to build stronger connections
        </p>
      </div>
    </div>
  );
};