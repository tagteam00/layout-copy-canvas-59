
import React, { useState } from "react";
import { TagTeamSheet } from "../TagTeamSheet";
import { TransformedTeam } from "@/types/tagteam";
import { LimitReachedDialog } from "@/components/ui/limit-reached-dialog";
import { checkTagTeamLimit } from "@/utils/teamLimitUtils";
import { useEffect } from "react";

interface TagTeamSheetWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTagTeam: TransformedTeam | null;
  currentUserId: string;
}

export const TagTeamSheetWrapper: React.FC<TagTeamSheetWrapperProps> = ({
  isOpen,
  onClose,
  selectedTagTeam,
  currentUserId,
}) => {
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Check for team limit when accepting requests
  const handleAcceptRequest = async () => {
    if (!currentUserId) return false;
    
    try {
      const { isAtLimit } = await checkTagTeamLimit(currentUserId);
      if (isAtLimit) {
        setIsLimitReached(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking team limit:", error);
      return false;
    }
  };

  const handleCloseLimitDialog = () => {
    setIsLimitReached(false);
  };

  return (
    <>
      {selectedTagTeam && (
        <TagTeamSheet
          isOpen={isOpen}
          onClose={onClose}
          tagTeam={selectedTagTeam}
          currentUserId={currentUserId}
          onBeforeAcceptRequest={handleAcceptRequest}
        />
      )}
      
      <LimitReachedDialog
        isOpen={isLimitReached}
        onClose={handleCloseLimitDialog}
        context="accept"
      />
    </>
  );
};
