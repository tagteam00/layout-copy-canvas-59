import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { formatInterestName } from "@/utils/interestUtils";
import { ManageInterestsSheet } from "./ManageInterestsSheet";
interface ProfileInterestsProps {
  interests: string[];
  onUpdate?: () => Promise<void>;
}
export const ProfileInterests: React.FC<ProfileInterestsProps> = ({
  interests,
  onUpdate = async () => {}
}) => {
  return <Card className="border border-gray-100 shadow-sm bg-[ECEAFF] bg-[#eceaff] px-0 py-[8px] my-[12px]">
      <CardHeader className="pb-2 bg-[ECEAFF] px-0 my-[2px] py-[4px]">
        <h2 className="text-lg font-semibold my-0 py-0 px-[16px]">Interests:</h2>
      </CardHeader>
      <CardContent className="py-0 px-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 px-[16px]">
            {interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-white px-4 whitespace-nowrap py-[7px] bg-[#6be04d]"
              >
                {formatInterestName(interest)}
              </Badge>
            ))}
          </div>
          
          <div className="px-[16px] pb-2">
            <ManageInterestsSheet currentInterests={interests} onUpdate={onUpdate}>
              <Button 
                variant="secondary" 
                className="w-full flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                Manage your Interests
              </Button>
            </ManageInterestsSheet>
          </div>
        </div>
      </CardContent>
    </Card>;
};