
import React from "react";
import { Button } from "@/components/ui/button";

interface CreateTeamNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const CreateTeamNavigation: React.FC<CreateTeamNavigationProps> = ({
  currentStepIndex,
  totalSteps,
  canProceed,
  onBack,
  onNext
}) => {
  return (
    <div className="flex justify-between gap-2 mt-8">
      {currentStepIndex > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
      )}
      <Button
        type="button"
        className="bg-black text-white hover:bg-black/90 ml-auto"
        onClick={onNext}
        disabled={!canProceed}
      >
        {currentStepIndex === totalSteps - 1 ? "Send Request" : "Next"}
      </Button>
    </div>
  );
};
