
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

  return (
    <div className="flex justify-between gap-4">
      <Button 
        className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]"
        onClick={onMarkPending}
        disabled={isSubmitting || isDisabled}
      >
        Mark Pending
      </Button>
      <Button 
        className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]"
        onClick={onMarkCompleted}
        disabled={isSubmitting || isDisabled}
      >
        Completed
      </Button>
    </div>
  );
};
