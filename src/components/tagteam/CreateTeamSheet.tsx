
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { useCreateTeamForm } from "./hooks/useCreateTeamForm";
import { CreateTeamNavigation } from "./components/CreateTeamNavigation";
import { CreateTeamStepContent } from "./components/CreateTeamStepContent";
import { CreateTeamLoading } from "./components/CreateTeamLoading";

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
  const {
    currentStep,
    teamName,
    setTeamName,
    selectedCategory,
    setSelectedCategory,
    setSelectedPartner,
    setPartnerId,
    frequency,
    setFrequency,
    loading,
    steps,
    currentStepIndex,
    canProceed,
    handleNext,
    handleBack
  } = useCreateTeamForm({ isOpen, categories, onClose });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <SheetHeader className="mb-6">
          <SheetTitle>Create New TagTeam</SheetTitle>
          <StepIndicator currentStep={currentStepIndex + 1} totalSteps={steps.length} />
        </SheetHeader>
        
        {loading ? (
          <CreateTeamLoading />
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <CreateTeamStepContent
              currentStep={currentStep}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setSelectedPartner={setSelectedPartner}
              setPartnerId={setPartnerId}
              frequency={frequency}
              setFrequency={setFrequency}
              teamName={teamName}
              setTeamName={setTeamName}
            />
            
            <CreateTeamNavigation
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              canProceed={canProceed()}
              onBack={handleBack}
              onNext={handleNext}
            />
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};
