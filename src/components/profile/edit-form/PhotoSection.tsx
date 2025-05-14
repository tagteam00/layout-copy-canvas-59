
import React from "react";
import { ProfileImageUploader } from "../ProfileImageUploader";
import { Label } from "@/components/ui/label";

interface PhotoSectionProps {
  avatarUrl: string | null | undefined;
  username: string;
  onImageChange: (file: File | null) => void;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({
  avatarUrl,
  username,
  onImageChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium mb-2 block">Profile Photo</Label>
      
      <div className="flex flex-col items-center">
        <ProfileImageUploader
          currentImageUrl={avatarUrl || undefined}
          onImageChange={onImageChange}
          username={username}
          size="xl"
        />
        <p className="text-xs text-gray-500 mt-2">
          Images will be compressed to less than 100KB
        </p>
      </div>
    </div>
  );
};
