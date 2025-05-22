
import React from "react";
import { StatusButtons } from "./verification/StatusButtons";
import { StatusMessage } from "./verification/StatusMessage";
import { usePartnerVerification } from "@/hooks/usePartnerVerification";
import { CongratsDialog } from "@/components/tagteam/CongratsDialog";

interface PartnerVerificationSectionProps {
  partnerName: string;
  partnerId: string;
  userId: string;
  teamId: string;
  teamName?: string;
  onStatusUpdate: (status: "completed" | "pending") => void;
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  partnerName,
  partnerId,
  userId,
  teamId,
  teamName = "TagTeam",
  onStatusUpdate
}) => {
  const {
    isSubmitting,
    hasLoggedActivity,
    showCongrats,
    setShowCongrats,
    handleStatusChange,
    getFirstName
  } = usePartnerVerification({
    teamId,
    userId,
    partnerId,
    teamName,
    partnerName
  });

  const handleMarkPending = async () => {
    const status = await handleStatusChange("pending");
    onStatusUpdate(status);
  };

  const handleMarkCompleted = async () => {
    const status = await handleStatusChange("completed");
    onStatusUpdate(status);
  };

  const getFrequencyText = () => {
    // Get activity frequency from the team data
    // Default to "Daily" if not available
    return "Daily";
  };

  return (
    <div className="mt-auto mb-6">
      <StatusMessage 
        partnerFirstName={getFirstName(partnerName)}
        hasLoggedActivity={hasLoggedActivity}
        frequencyText={getFrequencyText()}
      />
      
      <StatusButtons 
        onMarkPending={handleMarkPending}
        onMarkCompleted={handleMarkCompleted}
        isSubmitting={isSubmitting}
        isDisabled={hasLoggedActivity}
      />
      
      {/* Congratulations Dialog */}
      <CongratsDialog 
        isOpen={showCongrats} 
        onOpenChange={setShowCongrats}
        teamName={teamName}
        partnerName={partnerName}
      />
    </div>
  );
};
