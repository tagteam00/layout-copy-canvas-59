
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PartnerVerificationSectionProps {
  partnerName: string;
  onStatusUpdate: (status: "completed" | "pending") => void;
  isUpdating?: boolean;
  currentStatus?: "completed" | "pending";
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  partnerName,
  onStatusUpdate,
  isUpdating = false,
  currentStatus = "pending"
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
        Has {getFirstName(partnerName)} completed {currentStatus === "completed" ? "their" : "his"} Daily goal?
      </p>
      
      <div className="flex justify-between gap-4">
        <Button 
          className={`flex-1 ${currentStatus === "pending" ? "bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          onClick={() => onStatusUpdate("pending")}
          disabled={isUpdating || currentStatus === "pending"}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
          ) : null}
          Mark Pending
        </Button>
        <Button 
          className={`flex-1 ${currentStatus === "completed" ? "bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          onClick={() => onStatusUpdate("completed")}
          disabled={isUpdating || currentStatus === "completed"}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
          ) : null}
          Completed
        </Button>
      </div>
    </div>
  );
};
