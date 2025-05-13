
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PartnerVerificationSectionProps {
  partnerName: string;
  onStatusUpdate: (status: "completed" | "pending") => void;
  isSubmitting?: boolean;
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  partnerName,
  onStatusUpdate,
  isSubmitting = false
}) => {
  // Get the first name only for display, with null/undefined check
  const getFirstName = (fullName: string | undefined | null): string => {
    if (!fullName) {
      return "Partner"; // Default fallback name
    }
    return fullName.split(' ')[0];
  };

  return (
    <div className="mt-auto mb-6">
      <p className="text-center text-[16px] font-medium mb-4">
        Has {getFirstName(partnerName)} completed their goal?
      </p>
      
      <div className="flex justify-between gap-4">
        <Button 
          className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]"
          onClick={() => onStatusUpdate("pending")}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Mark Pending
        </Button>
        <Button 
          className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]"
          onClick={() => onStatusUpdate("completed")}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Completed
        </Button>
      </div>
    </div>
  );
};
