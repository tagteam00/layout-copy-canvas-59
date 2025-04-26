
import React from "react";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileBio } from "./ProfileBio";
import { ProfileCommitment } from "./ProfileCommitment";
import { ProfileInterests } from "./ProfileInterests";
import { LogoutButton } from "./LogoutButton";

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
  isPublicView?: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userProfile,
  onProfileUpdate,
  isPublicView = false
}) => {
  return (
    <div className="p-6 space-y-6 relative bg-white py-[36px]">
      <ProfileHeader userProfile={userProfile} />
      <ProfileBio bio={userProfile.bio} />
      
      <div className="space-y-4">
        <ProfileCommitment commitmentLevel={userProfile.commitmentLevel} />
        <ProfileInterests 
          interests={userProfile.interests} 
          isPublicView={isPublicView}
        />
      </div>
      
      {!isPublicView && (
        <div className="pt-4">
          <LogoutButton />
        </div>
      )}
    </div>
  );
};
