
import React from "react";
import { Button } from "@/components/ui/button";

interface StatusButtonsProps {
  onMarkPending: () => void;
  onMarkCompleted: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  showButtons: boolean;
}

export const StatusButtons: React.FC<StatusButtonsProps> = ({
  onMarkPending,
  onMarkCompleted,
  isSubmitting,
  isDisabled,
  showButtons
}) => {
  if (!showButtons) {
    return null;
  }

  const handlePendingClick = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isSubmitting && !isDisabled) {
      onMarkPending();
    }
  };

  const handleCompletedClick = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isSubmitting && !isDisabled) {
      onMarkCompleted();
    }
  };

  return (
    <div className="flex justify-between gap-4 touch-none select-none">
      <Button 
        className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF] active:bg-[#FFBFBF] min-h-[48px] touch-manipulation"
        onClick={handlePendingClick}
        onTouchStart={handlePendingClick}
        disabled={isSubmitting || isDisabled}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        Mark Pending
      </Button>
      <Button 
        className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC] active:bg-[#BCFFBC] min-h-[48px] touch-manipulation"
        onClick={handleCompletedClick}
        onTouchStart={handleCompletedClick}
        disabled={isSubmitting || isDisabled}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        Completed
      </Button>
    </div>
  );
};
