
import React from "react";

interface ProfileBioProps {
  bio?: string;
}

export const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  if (!bio) return null;
  
  return (
    <p className="text-center text-gray-600 max-w-md mx-auto text-sm">
      {bio}
    </p>
  );
};
