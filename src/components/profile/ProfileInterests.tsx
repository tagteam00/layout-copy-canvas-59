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
  return <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-2 py-0">
        <h2 className="text-lg font-semibold">Interests:</h2>
      </CardHeader>
      <CardContent className="py-0">
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-none">
          {interests.map((interest, index) => <Badge key={index} variant="secondary" className="bg-[#827AFF] text-white hover:bg-[#827AFF]/90 px-4 py-1.5 whitespace-nowrap rounded-full flex-shrink-0">
              {interest}
            </Badge>)}
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0 w-8 h-8 border-[#827AFF] text-[#827AFF]">
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Add interest</span>
          </Button>
        </div>
      </CardContent>
    </Card>;
};