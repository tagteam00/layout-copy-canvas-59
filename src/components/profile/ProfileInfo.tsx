
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

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
  };
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ userProfile }) => {
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24 bg-[#FFE0E0]">
          <AvatarFallback className="text-3xl text-[#FF9999]">
            {getInitials(userProfile.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">{userProfile.fullName}</h1>
          <p className="text-gray-500">@{userProfile.username}</p>
        </div>
        {userProfile.occupation && (
          <p className="text-gray-600">{userProfile.occupation}</p>
        )}
      </div>

      <div className="space-y-2">
        {(userProfile.city || userProfile.country) && (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{[userProfile.city, userProfile.country].filter(Boolean).join(', ')}</span>
          </div>
        )}
        {userProfile.dateOfBirth && (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(userProfile.dateOfBirth)}</span>
          </div>
        )}
      </div>

      {userProfile.bio && (
        <p className="text-center text-gray-600 max-w-md mx-auto">
          {userProfile.bio}
        </p>
      )}

      <div className="bg-[#F3F0FF] rounded-xl p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Commitment:</h2>
          <Badge variant="secondary" className="bg-white">
            {userProfile.commitmentLevel}
          </Badge>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests.map((interest, index) => (
              <Badge 
                key={index}
                className="bg-[#E9E5FF] text-[#827AFF] hover:bg-[#E9E5FF]"
              >
                {interest}
              </Badge>
            ))}
            <Badge 
              className="bg-[#E9E5FF] text-[#827AFF] hover:bg-[#E9E5FF] cursor-pointer"
            >
              +
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
