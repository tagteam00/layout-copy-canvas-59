
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface ProfileInterestsProps {
  interests: string[];
}

export const ProfileInterests: React.FC<ProfileInterestsProps> = ({ interests }) => {
  return (
    <Card className="bg-white shadow-sm px-0 py-[28px]">
      <CardHeader>
        <h2 className="text-lg font-semibold">Interests</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[#827AFF] text-white hover:bg-[#827AFF]/90 px-[16px] py-[8px]"
            >
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
