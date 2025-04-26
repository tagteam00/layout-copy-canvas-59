import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
interface ProfileInterestsProps {
  interests: string[];
}
export const ProfileInterests: React.FC<ProfileInterestsProps> = ({
  interests
}) => {
  return <Card className="border border-gray-100 shadow-sm bg-[ECEAFF] bg-[#eceaff] px-0 py-[8px] my-[12px]">
      <CardHeader className="pb-2 bg-[ECEAFF] px-0 my-[2px] py-[4px]">
        <h2 className="text-lg font-semibold px-[8px] my-0 py-0">Interests:</h2>
      </CardHeader>
      <CardContent className="py-0 px-0">
        <div className="flex flex-wrap gap-2 pb-2 px-[8px]">
          {interests.map((interest, index) => <Badge key={index} variant="secondary" className="text-white px-4 whitespace-nowrap py-[7px] bg-[#6be04d]">
              {interest}
            </Badge>)}
          <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-[#827AFF] text-[#827AFF]">
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Add interest</span>
          </Button>
        </div>
      </CardContent>
    </Card>;
};