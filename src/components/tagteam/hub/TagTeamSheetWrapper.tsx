
import React from "react";
import { TagTeamSheet } from "@/components/tagteam/TagTeamSheet";
import { TransformedTeam } from "@/types/tagteam";

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
  currentUserId
}) => {
  if (!selectedTagTeam) return null;
  
  return (
    <TagTeamSheet 
      isOpen={isOpen}
      onClose={onClose}
      tagTeam={selectedTagTeam}
      currentUserId={currentUserId}
    />
  );
};
