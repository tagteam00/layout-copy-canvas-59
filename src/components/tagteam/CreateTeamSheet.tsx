
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CreateTeamStep } from "@/types/tagteam";
import { NameStep } from "./steps/NameStep";
import { InterestStep } from "./steps/InterestStep";
import { PartnerStep } from "./steps/PartnerStep";
import { FrequencyStep } from "./steps/FrequencyStep";
import { StepIndicator } from "@/components/onboarding/StepIndicator";

interface CreateTeamSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (team: any) => void;
  categories: string[];
}

export const CreateTeamSheet: React.FC<CreateTeamSheetProps> = ({
  isOpen,
  onClose,
  onCreateTeam,
  categories,
}) => {
  const [currentStep, setCurrentStep] = useState<CreateTeamStep>("name");
  const [teamName, setTeamName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");
  const [frequency, setFrequency] = useState<{ type: 'daily' | 'weekly'; day?: string }>({
    type: 'daily'
  });

  const steps: CreateTeamStep[] = ["name", "interest", "partner", "frequency"];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  const handleSubmit = () => {
    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
      category: selectedCategory,
      timeLeft: "24hrs Left",
      frequency: frequency.type === 'weekly' ? `Weekly (${frequency.day})` : 'Daily',
      members: `${selectedPartner}`,
    };

    onCreateTeam(newTeam);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTeamName("");
    setSelectedCategory("");
    setSelectedPartner("");
    setFrequency({ type: 'daily' });
    setCurrentStep("name");
  };

  const canProceed = () => {
    switch (currentStep) {
      case "name":
        return teamName.trim().length > 0;
      case "interest":
        return selectedCategory.length > 0;
      case "partner":
        return selectedPartner.length > 0;
      case "frequency":
        return frequency.type === 'daily' || (frequency.type === 'weekly' && frequency.day);
      default:
        return false;
    }
  };

  const getCurrentStep = () => {
    switch (currentStep) {
      case "name":
        return <NameStep teamName={teamName} setTeamName={setTeamName} />;
      case "interest":
        return (
          <InterestStep
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case "partner":
        return (
          <PartnerStep
            selectedCategory={selectedCategory}
            onSelectPartner={setSelectedPartner}
          />
        );
      case "frequency":
        return <FrequencyStep frequency={frequency} setFrequency={setFrequency} />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <SheetHeader className="mb-6">
          <SheetTitle>Create New TagTeam</SheetTitle>
          <StepIndicator currentStep={currentStepIndex + 1} totalSteps={steps.length} />
        </SheetHeader>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {getCurrentStep()}

          <div className="flex justify-between gap-2 mt-8">
            {currentStepIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              className="bg-black text-white hover:bg-black/90 ml-auto"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStepIndex === steps.length - 1 ? "Create Team" : "Next"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
