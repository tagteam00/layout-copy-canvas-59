import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileSheet } from "./EditProfileSheet";
import { useNavigate } from "react-router-dom";

interface ProfileInfoProps {
  userProfile: {
    fullName: string;
    username: string;
    dateOfBirth: string;
    occupation: string;
    bio: string;
    city?: string;
    country?: string;
    interests: string[];
    commitmentLevel: string;
    gender: string;
  };
  onProfileUpdate: () => Promise<void>;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ userProfile, onProfileUpdate }) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6 relative bg-[#F8F7FF]">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
          className="rounded-full"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <EditProfileSheet 
          currentProfile={userProfile}
          onProfileUpdate={onProfileUpdate}
        />
      </div>

      {/* Profile Header with Avatar */}
      <div className="flex flex-col items-center mt-8">
        <Avatar className="w-24 h-24 bg-[#FFE0E0]">
          <AvatarFallback className="text-3xl text-[#FF9999]">
            {getInitials(userProfile.fullName)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name and Username */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold">{userProfile.fullName}</h1>
        <p className="text-gray-500">@{userProfile.username}</p>
        {userProfile.occupation && (
          <p className="text-gray-600 text-lg">{userProfile.occupation}</p>
        )}
      </div>

      {/* Location and Date */}
      <div className="flex justify-center gap-6 text-gray-600">
        {(userProfile.city || userProfile.country) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{[userProfile.city, userProfile.country].filter(Boolean).join(', ')}</span>
          </div>
        )}
        {userProfile.dateOfBirth && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(userProfile.dateOfBirth)}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {userProfile.bio && (
        <p className="text-center text-gray-600 max-w-md mx-auto">
          {userProfile.bio}
        </p>
      )}

      {/* Commitment Card */}
      <div className="bg-[#F3F0FF] rounded-xl p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Commitment:</h2>
          <Badge variant="secondary" className="bg-white">
            {userProfile.commitmentLevel}
          </Badge>
        </div>
      </div>
      
      {/* Interests Card */}
      <div className="bg-[#F3F0FF] rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {userProfile.interests.map((interest, index) => (
            <div key={index} className="bg-[#E9E5FF] rounded-full pl-3 pr-2 py-1 flex items-center gap-1">
              <span className="text-[#827AFF]">{interest}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
