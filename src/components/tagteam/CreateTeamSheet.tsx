
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
import { LimitReachedDialog } from "../ui/limit-reached-dialog";
import { checkTagTeamLimit } from "@/utils/teamLimitUtils";
import { useUserProfile } from "@/hooks/useUserProfile";

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
  const [frequency, setFrequency] = useState<{ type: 'daily' | 'weekly'; day?: string }>({
    type: 'daily'
  });
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);
  const userInterests = categories || [];
  const { getUserData } = useUserData();
  const { userProfile } = useUserProfile();
  const [loading, setLoading] = useState(false);

  // Check tag team limit when sheet opens
  useEffect(() => {
    if (isOpen && userProfile.id) {
      setIsCheckingLimit(true);
      checkTagTeamLimit(userProfile.id)
        .then(({ isAtLimit }) => {
          setIsLimitReached(isAtLimit);
          if (isAtLimit) {
            // If at limit, don't proceed with form
            console.log("User has reached tag team limit");
          } else if (userInterests && userInterests.length > 0) {
            setSelectedCategory(userInterests[0]);
          }
        })
        .finally(() => {
          setIsCheckingLimit(false);
        });
    }
  }, [isOpen, userProfile.id, userInterests]);

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
      
      // Double-check the tag team limit before submitting
      const { isAtLimit } = await checkTagTeamLimit(authData.user.id);
      if (isAtLimit) {
        setIsLimitReached(true);
        setLoading(false);
        return;
      }

      // Format the frequency string to include the reset day for weekly frequency
      const formattedFrequency = frequency.type === 'daily' 
        ? 'Daily' 
        : `Weekly (${frequency.day})`;

      const { error } = await supabase
        .from('team_requests')
        .insert({
          name: teamName,
          category: selectedCategory,
          frequency: formattedFrequency,
          sender_id: authData.user.id,
          receiver_id: partnerId,
          status: 'pending',
          reset_day: frequency.type === 'weekly' ? frequency.day : undefined
        });

      if (error) throw error;

      toast.success(`Request sent to ${selectedPartner}`);
      resetForm();
      onCreateTeam({});
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
    setIsLimitReached(false);
  };

  const handleCloseLimitDialog = () => {
    setIsLimitReached(false);
    onClose();
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
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Create New TagTeam</SheetTitle>
            <StepIndicator currentStep={currentStepIndex + 1} totalSteps={steps.length} />
          </SheetHeader>
          
          {isCheckingLimit ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ) : loading ? (
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

      <LimitReachedDialog
        isOpen={isLimitReached}
        onClose={handleCloseLimitDialog}
        context="send"
      />
    </>
  );
};
