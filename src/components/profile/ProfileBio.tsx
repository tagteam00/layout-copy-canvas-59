
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileBioProps {
  bio?: string;
}

export const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  if (!bio) return null;
  
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="pt-4">
        <p className="text-gray-700 text-sm">
          {bio}
        </p>
      </CardContent>
    </Card>
  );
};
