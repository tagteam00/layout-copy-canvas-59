import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface ProfileInfoProps {
  userProfile: {
    dateOfBirth: string;
    gender: string;
    commitmentLevel: string;
    interests: string[];
  };
}
export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userProfile
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  return <>
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span>{formatDate(userProfile.dateOfBirth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span>{userProfile.gender || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Commitment Level:</span>
              <Badge variant="outline">{userProfile.commitmentLevel || "Not set"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        
      </Card>
    </>;
};