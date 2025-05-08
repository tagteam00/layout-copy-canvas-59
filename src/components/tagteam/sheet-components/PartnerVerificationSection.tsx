
import React from "react";
import { Button } from "@/components/ui/button";

interface PartnerVerificationSectionProps {
  partnerName: string;
  onStatusUpdate: (status: "completed" | "pending") => void;
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  partnerName,
  onStatusUpdate
}) => {
  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  return (
    <div className="mt-auto mb-6">
      <p className="text-center text-[16px] font-medium mb-4">
        Has {getFirstName(partnerName)} completed his Daily goal?
      </p>
      
      <div className="flex justify-between gap-4">
        <Button 
          className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]"
          onClick={() => onStatusUpdate("pending")}
        >
          Mark Pending
        </Button>
        <Button 
          className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]"
          onClick={() => onStatusUpdate("completed")}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};
