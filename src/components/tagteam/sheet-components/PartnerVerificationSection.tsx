
import React from "react";
import { Button } from "@/components/ui/button";
import { TagTeam } from "@/types/tagteam";

interface PartnerVerificationSectionProps {
  isCurrentUserFirst: boolean;
  tagTeam: TagTeam;
  currentUserId: string;
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  isCurrentUserFirst,
  tagTeam,
  currentUserId
}) => {
  // Get the partner name based on whether current user is first or second
  const partnerName = isCurrentUserFirst ? tagTeam.secondUser.name : tagTeam.firstUser.name;
  
  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  // Handler for marking partner's status
  const handleStatusUpdate = (status: "completed" | "pending") => {
    // Implementation will be added later
    console.log(`Marking ${partnerName}'s status as ${status}`);
  };

  return (
    <div className="mt-auto mb-6">
      <p className="text-center text-[16px] font-medium mb-4">
        Has {getFirstName(partnerName)} completed his Daily goal?
      </p>
      
      <div className="flex justify-between gap-4">
        <Button 
          className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]"
          onClick={() => handleStatusUpdate("pending")}
        >
          Mark Pending
        </Button>
        <Button 
          className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]"
          onClick={() => handleStatusUpdate("completed")}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};
