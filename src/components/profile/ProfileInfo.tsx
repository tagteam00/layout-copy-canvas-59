
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Briefcase, ScrollText } from "lucide-react";

interface ProfileInfoProps {
  userProfile: {
    dateOfBirth: string;
    gender: string;
    commitmentLevel: string;
    interests: string[];
    city?: string;
    country?: string;
    occupation?: string;
    bio?: string;
  };
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ userProfile }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const renderInfoCard = (icon: React.ReactNode, title: string, value: string) => (
    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="font-semibold">{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Personal Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {renderInfoCard(
              <Calendar className="text-primary" />, 
              "Date of Birth", 
              formatDate(userProfile.dateOfBirth)
            )}
            {renderInfoCard(
              <MapPin className="text-primary" />, 
              "Location", 
              `${userProfile.city || ''}, ${userProfile.country || ''}`.trim() || "Not provided"
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {renderInfoCard(
              <Briefcase className="text-primary" />, 
              "Occupation", 
              userProfile.occupation
            )}
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <ScrollText className="text-primary" />
              <div>
                <p className="text-sm text-gray-600">Bio</p>
                <p className="font-semibold">{userProfile.bio || "No bio yet"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Profile Insights</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Commitment Level</span>
              <Badge variant="outline">{userProfile.commitmentLevel || "Not set"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Interests</h2>
          {userProfile.interests && userProfile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No interests added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
