
import React from "react";
import { EditProfileSheet } from "./EditProfileSheet";

interface ProfileHeaderProps {
  userProfile: {
    fullName: string;
    username: string;
    profileImage: string;
    interests: string[];
    dateOfBirth: string;
    gender: string;
    commitmentLevel: string;
  };
  onProfileUpdate: () => Promise<void>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userProfile, onProfileUpdate }) => {
  return (
    <div className="flex items-center mb-6">
      <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
        <img 
          src={userProfile.profileImage} 
          alt={userProfile.username}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{userProfile.fullName || "New User"}</h1>
            <p className="text-gray-600">@{userProfile.username || "username"}</p>
          </div>
          <EditProfileSheet 
            currentProfile={userProfile}
            onProfileUpdate={onProfileUpdate}
          />
        </div>
      </div>
    </div>
  );
};
