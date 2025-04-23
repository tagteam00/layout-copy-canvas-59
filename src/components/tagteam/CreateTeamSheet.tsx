
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
}) => {
  const [currentStep, setCurrentStep] = useState<CreateTeamStep>("name");
  const [teamName, setTeamName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [frequency, setFrequency] = useState<{ type: 'daily' | 'weekly'; day?: string }>({
    type: 'daily'
  });
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const { getUserData } = useUserData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInterests = async () => {
      setLoading(true);
      try {
        const userData = await getUserData();
        if (userData && userData.interests) {
          setUserInterests(userData.interests);
          if (userData.interests.length > 0) {
            setSelectedCategory(userData.interests[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching user interests:", error);
        toast.error("Failed to load your interests");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserInterests();
    }
  }, [isOpen]);

  const steps: CreateTeamStep[] = ["name", "interest", "frequency", "partner"];
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
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast.error("You must be logged in to create a TagTeam");
        return;
      }

      const teamRequest = {
        name: teamName,
        category: selectedCategory,
        frequency: frequency.type === 'weekly' ? `Weekly (${frequency.day})` : 'Daily',
        sender_id: authData.user.id,
        receiver_id: partnerId,
        status: 'pending'
      };

      // Insert the team request into the database
      const { error } = await supabase
        .from('team_requests')
        .insert(teamRequest);

      if (error) throw error;

      toast.success(`Request sent to ${selectedPartner}`);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error sending team request:", error);
      toast.error("Failed to send team request");
    }
  };

  const resetForm = () => {
    setTeamName("");
    setSelectedCategory("");
    setSelectedPartner("");
    setPartnerId("");
    setFrequency({ type: 'daily' });
    setCurrentStep("name");
  };

  const canProceed = () => {
    switch (currentStep) {
      case "name":
        return teamName.trim().length > 0;
      case "interest":
        return selectedCategory.length > 0;
      case "frequency":
        return frequency.type === 'daily' || (frequency.type === 'weekly' && frequency.day);
      case "partner":
        return selectedPartner.length > 0;
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
            categories={userInterests}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case "frequency":
        return <FrequencyStep frequency={frequency} setFrequency={setFrequency} />;
      case "partner":
        return (
          <PartnerStep
            selectedCategory={selectedCategory}
            onSelectPartner={setSelectedPartner}
            onSelectPartnerId={setPartnerId}
          />
        );
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
