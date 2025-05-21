
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { logPartnerActivity } from "@/services/activityService";
import { toast } from "sonner";

interface PartnerVerificationSectionProps {
  partnerName: string;
  partnerId: string;
  userId: string;
  teamId: string;
  onStatusUpdate: (status: "completed" | "pending") => void;
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  partnerName,
  partnerId,
  userId,
  teamId,
  onStatusUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  const handleStatusChange = async (status: "completed" | "pending") => {
    try {
      setIsSubmitting(true);
      
      // Log the partner's activity status
      await logPartnerActivity(
        teamId,
        userId,      // logged by current user
        partnerId,   // verifying partner's status
        status
      );
      
      onStatusUpdate(status);
      
      toast.success(`${getFirstName(partnerName)}'s status marked as ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to update ${getFirstName(partnerName)}'s status`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-auto mb-6">
      <p className="text-center text-[16px] font-medium mb-4">
        Has {getFirstName(partnerName)} completed his Daily goal?
      </p>
      
      <div className="flex justify-between gap-4">
        <Button 
          className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]"
          onClick={() => handleStatusChange("pending")}
          disabled={isSubmitting}
        >
          Mark Pending
        </Button>
        <Button 
          className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]"
          onClick={() => handleStatusChange("completed")}
          disabled={isSubmitting}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};
