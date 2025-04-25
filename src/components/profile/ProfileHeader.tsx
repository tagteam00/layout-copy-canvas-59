
import React from "react";
import { EditProfileSheet } from "./EditProfileSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  userProfile: {
    fullName: string;
    username: string;
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

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  onProfileUpdate
}) => {
  // Function to get initials
  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(name => name.charAt(0).toUpperCase()).slice(0, 2).join('');
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <Avatar className="w-32 h-32 border-4 border-primary">
        <AvatarFallback className="text-4xl font-bold text-primary bg-gray-100">
          {getInitials(userProfile.fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center mt-4">
        <div className="flex items-center justify-center space-x-2 font-thin text-base text-center">
          <h1 className="text-2xl font-bold">{userProfile.fullName || "New User"}</h1>
          <EditProfileSheet currentProfile={userProfile} onProfileUpdate={onProfileUpdate} />
        </div>
        <p className="text-gray-600">@{userProfile.username || "username"}</p>
      </div>
    </div>
  );
};
