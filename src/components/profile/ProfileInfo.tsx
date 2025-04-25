
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileBio } from "./ProfileBio";
import { ProfileCommitment } from "./ProfileCommitment";
import { ProfileInterests } from "./ProfileInterests";

interface ProfileInfoProps {
  userProfile: {
    fullName: string;
    username: string;
    dateOfBirth: string;
    gender: string;
    interests: string[];
    commitmentLevel: string;
    city?: string;
    country?: string;
    occupation?: string;
    bio?: string;
  };
  onProfileUpdate: () => Promise<void>;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userProfile,
  onProfileUpdate
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 relative bg-white">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <ProfileHeader
        userProfile={userProfile}
        onProfileUpdate={onProfileUpdate}
      />

      <ProfileBio bio={userProfile.bio} />
      
      <div className="space-y-4">
        <ProfileCommitment commitmentLevel={userProfile.commitmentLevel} />
        <ProfileInterests interests={userProfile.interests} />
      </div>
    </div>
  );
};
