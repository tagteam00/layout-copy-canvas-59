
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pin, Calendar } from "lucide-react";

interface ProfileHeaderProps {
  userProfile: {
    id?: string; // Added id field (optional since it might not be used in this component)
    fullName: string;
    username: string;
    dateOfBirth: string;
    gender?: string;
    city?: string;
    country?: string;
    occupation?: string;
    avatarUrl?: string | null;
  };
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile
}) => {
  // Get initials from full name
  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  // Format date of birth
  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('en-US', {
        month: 'long'
      });
      const year = date.getFullYear();

      // Add suffix to day
      const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
      return `${day}${suffix} ${month} ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  const location = userProfile.city && userProfile.country ? `${userProfile.city}, ${userProfile.country}` : userProfile.city || userProfile.country || "Location not specified";
  
  return <div className="mb-6">
      <div className="flex items-start mb-6">
        <div className="relative my-[18px]">
          <Avatar className="w-24 h-24 border-2 border-white shadow-md bg-pink-100 text-gray-800">
            {userProfile.avatarUrl ? (
              <AvatarImage 
                src={userProfile.avatarUrl} 
                alt={userProfile.fullName || "User"} 
                className="object-cover"
              />
            ) : null}
            <AvatarFallback>{getInitials(userProfile.fullName || "User")}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 ml-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between my-0">
            <div>
              <h1 className="text-2xl font-bold my-0">{userProfile.fullName || "User"}</h1>
              <p className="text-gray-500 mb-1 py-0">@{userProfile.username || "username"}</p>
              {userProfile.occupation && <p className="text-gray-700 text-sm">{userProfile.occupation}</p>}
            </div>
            
            <div className="mt-2 md:mt-0 text-sm my-[16px]">
              <div className="flex items-center mb-2 text-gray-600">
                <Pin className="h-4 w-4 mr-2 text-[#827AFF]" />
                <span>{location}</span>
              </div>
              
              {userProfile.dateOfBirth && <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-[#827AFF]" />
                  <span>{formatDateOfBirth(userProfile.dateOfBirth)}</span>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
