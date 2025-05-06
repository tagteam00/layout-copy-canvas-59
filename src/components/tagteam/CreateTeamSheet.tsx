import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CreateTeamStep } from "@/types/tagteam";
import { NameStep } from "./steps/NameStep";
import { InterestStep } from "./steps/InterestStep";
import { PartnerStep } from "./steps/PartnerStep";
import { FrequencyStep } from "./steps/FrequencyStep";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [currentStep, setCurrentStep] = useState<CreateTeamStep>("interest");
  const [teamName, setTeamName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [frequency, setFrequency] = useState<{ type: 'daily' | 'weekly'; day?: string | number }>({
    type: 'daily'
  });
  const userInterests = categories || [];
  const { getUserData } = useUserData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userInterests && userInterests.length > 0) {
      setSelectedCategory(userInterests[0]);
    }
  }, [isOpen, userInterests]);

  const steps: CreateTeamStep[] = ["interest", "partner", "frequency", "name"];
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast.error("You must be logged in to create a TagTeam");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('team_requests')
        .insert({
          name: teamName,
          category: selectedCategory,
          frequency: frequency.type === 'weekly' ? `Weekly (${frequency.day})` : 'Daily',
          sender_id: authData.user.id,
          receiver_id: partnerId,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(`Request sent to ${selectedPartner}`);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error sending team request:", error);
      toast.error("Failed to send team request");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTeamName("");
    setSelectedCategory(userInterests[0] ?? "");
    setSelectedPartner("");
    setPartnerId("");
    setFrequency({ type: 'daily' });
    setCurrentStep("interest");
  };

  const canProceed = () => {
    switch (currentStep) {
      case "interest":
        return selectedCategory.length > 0;
      case "partner":
        return selectedPartner.length > 0 && partnerId.length > 0;
      case "frequency":
        return frequency.type === 'daily' || (frequency.type === 'weekly' && frequency.day);
      case "name":
        return teamName.trim().length > 0;
      default:
        return false;
    }
  };

  const getCurrentStep = () => {
    switch (currentStep) {
      case "interest":
        return (
          <InterestStep
            categories={userInterests}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case "partner":
        return (
          <PartnerStep
            selectedCategory={selectedCategory}
            onSelectPartner={setSelectedPartner}
            onSelectPartnerId={setPartnerId}
          />
        );
      case "frequency":
        return <FrequencyStep frequency={frequency} setFrequency={setFrequency} />;
      case "name":
        return <NameStep teamName={teamName} setTeamName={setTeamName} />;
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
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ) : (
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
                {currentStepIndex === steps.length - 1 ? "Send Request" : "Next"}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};
