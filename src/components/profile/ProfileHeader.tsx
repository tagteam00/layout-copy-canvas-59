
import React from "react";
import { EditProfileSheet } from "./EditProfileSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  userProfile: {
    fullName: string;
    username: string;
    profileImage: string;
    interests: string[];
    dateOfBirth: string;
    gender: string;
    commitmentLevel: string;
    city?: string;
    country?: string;
    occupation?: string;
    bio?: string;
  };
  onProfileUpdate: () => Promise<void>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userProfile, onProfileUpdate }) => {
  // Function to get initials
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center mb-4 bg-gray-100">
        {userProfile.profileImage ? (
          <AvatarImage 
            src={userProfile.profileImage} 
            alt={userProfile.username}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <AvatarFallback className="text-4xl font-bold text-primary">
            {getInitials(userProfile.fullName)}
          </AvatarFallback>
        )}
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-2xl font-bold">{userProfile.fullName || "New User"}</h1>
          <EditProfileSheet 
            currentProfile={userProfile}
            onProfileUpdate={onProfileUpdate}
          />
        </div>
        <p className="text-gray-600">@{userProfile.username || "username"}</p>
      </div>
    </div>
  );
};
