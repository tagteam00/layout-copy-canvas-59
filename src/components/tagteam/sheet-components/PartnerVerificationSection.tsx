
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { logPartnerActivity } from "@/services/teamActivityService";
import { toast } from "sonner";

interface PartnerVerificationSectionProps {
  partnerName?: string;
  partnerId: string;
  teamId: string;
  userId: string;
  onStatusUpdate: (status: "completed" | "pending") => void;
  isLoading?: boolean;
  userHasLoggedPartner?: boolean;
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  partnerName,
  partnerId,
  teamId,
  userId,
  onStatusUpdate,
  isLoading = false,
  userHasLoggedPartner = false
}) => {
  const [submitting, setSubmitting] = useState(false);
  
  // Get the first name only for display, with null/undefined check
  const getFirstName = (fullName: string | undefined | null): string => {
    if (!fullName) {
      return "Partner"; // Default fallback name
    }
    return fullName.split(' ')[0];
  };
  
  const handleStatusUpdate = async (status: "completed" | "pending") => {
    setSubmitting(true);
    try {
      // Call backend service to log activity
      const result = await logPartnerActivity(teamId, partnerId, userId, status);
      
      if (result) {
        onStatusUpdate(status);
        toast.success(status === "completed" 
          ? `You've marked ${getFirstName(partnerName)}'s goal as completed!` 
          : `You've marked ${getFirstName(partnerName)}'s goal as pending.`);
      } else {
        toast.error("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-auto mb-6">
      {!userHasLoggedPartner ? (
        <>
          <p className="text-center text-[16px] font-medium mb-4">
            Has {getFirstName(partnerName)} completed their goal?
          </p>
          
          <div className="flex justify-between gap-4">
            <Button 
              className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]"
              onClick={() => handleStatusUpdate("pending")}
              disabled={submitting || isLoading}
            >
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Mark Pending
            </Button>
            <Button 
              className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]"
              onClick={() => handleStatusUpdate("completed")}
              disabled={submitting || isLoading}
            >
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Completed
            </Button>
          </div>
        </>
      ) : (
        <div className="p-4 bg-[#F0F9FF] rounded-lg text-center">
          <p className="text-[16px] font-medium text-blue-700">
            You've already logged {getFirstName(partnerName)}'s activity for this cycle.
          </p>
        </div>
      )}
    </div>
  );
};
