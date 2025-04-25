
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  username: string;
  dateOfBirth: string;
  city?: string;
  country?: string;
  occupation?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  username,
  dateOfBirth,
  city,
  country,
  occupation
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 bg-[#FFE0E0]">
          <AvatarFallback className="text-3xl text-[#FF9999]">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">{fullName}</h1>
        <p className="text-gray-500">@{username}</p>
        {occupation && <p className="text-gray-600">{occupation}</p>}
      </div>

      <div className="flex justify-center gap-4 text-gray-600 text-sm">
        {(city || country) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{[city, country].filter(Boolean).join(', ')}</span>
          </div>
        )}
        {dateOfBirth && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(dateOfBirth)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
