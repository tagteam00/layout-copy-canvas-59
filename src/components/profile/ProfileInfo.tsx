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
}
export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userProfile,
  onProfileUpdate
}) => {
  return <div className="p-6 space-y-6 relative bg-white py-[36px]">
      <ProfileHeader userProfile={userProfile} />
      <ProfileBio bio={userProfile.bio} />
      
      <div className="space-y-4">
        <ProfileCommitment commitmentLevel={userProfile.commitmentLevel} />
        <ProfileInterests interests={userProfile.interests} />
      </div>
      
      <div className="pt-4">
        <LogoutButton />
      </div>
    </div>;
};