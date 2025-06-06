import { useState, useEffect } from "react";
import { CreateTeamStep } from "@/types/tagteam";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasActiveTeamForInterest, hasPendingRequestForInterest } from "@/services/teamService";

interface UseCreateTeamFormProps {
  isOpen: boolean;
  categories: string[];
  onClose: () => void;
}

export const useCreateTeamForm = ({ isOpen, categories, onClose }: UseCreateTeamFormProps) => {
  const [currentStep, setCurrentStep] = useState<CreateTeamStep>("interest");
  const [teamName, setTeamName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [frequency, setFrequency] = useState<{ type: 'daily' | 'weekly'; day?: string }>({
    type: 'daily'
  });
  const [loading, setLoading] = useState(false);

  const steps: CreateTeamStep[] = ["interest", "partner", "frequency", "name"];
  const currentStepIndex = steps.indexOf(currentStep);

  useEffect(() => {
    if (isOpen && categories && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [isOpen, categories]);

  const resetForm = () => {
    setTeamName("");
    setSelectedCategory(categories[0] ?? "");
    setSelectedPartner("");
    setPartnerId("");
    setFrequency({ type: 'daily' });
    setCurrentStep("interest");
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "interest":
        return selectedCategory.length > 0;
      case "partner":
        return selectedPartner.length > 0 && partnerId.length > 0;
      case "frequency":
        return frequency.type === 'daily' || (frequency.type === 'weekly' && Boolean(frequency.day));
      case "name":
        return teamName.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const nextStep = steps[currentStepIndex + 1];
    
    if (currentStep === "interest" && nextStep === "partner" && selectedCategory) {
      setLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          toast.error("You must be logged in to create a TagTeam");
          setLoading(false);
          return;
        }
        
        const hasActiveTeam = await hasActiveTeamForInterest(authData.user.id, selectedCategory);
        const hasPendingRequest = await hasPendingRequestForInterest(authData.user.id, selectedCategory);
        
        if (hasActiveTeam) {
          toast.error(`You already have an active TagTeam for ${selectedCategory}. Please end that team before creating a new one.`);
          setLoading(false);
          return;
        }
        
        if (hasPendingRequest) {
          toast.error(`You already have a pending request for ${selectedCategory}. Please wait for a response or cancel the request.`);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error checking active teams:", error);
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }
    
    if (nextStep) {
      setCurrentStep(nextStep);
    } else {
      await handleSubmit();
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

      const hasActiveTeam = await hasActiveTeamForInterest(authData.user.id, selectedCategory);
      if (hasActiveTeam) {
        toast.error(`You already have an active TagTeam for ${selectedCategory}. Please end that team before creating a new one.`);
        setLoading(false);
        return;
      }

      let formattedFrequency: string;
      let resetDay: string | undefined;

      if (frequency.type === 'daily') {
        formattedFrequency = 'Daily';
        resetDay = undefined;
      } else {
        const validDay = frequency.day || 'Monday';
        formattedFrequency = `Weekly (${validDay})`;
        resetDay = validDay;
      }

      console.log('Creating team request with:', {
        name: teamName,
        category: selectedCategory,
        frequency: formattedFrequency,
        reset_day: resetDay,
        sender_id: authData.user.id,
        receiver_id: partnerId
      });

      const { error } = await supabase
        .from('team_requests')
        .insert({
          name: teamName,
          category: selectedCategory,
          frequency: formattedFrequency,
          sender_id: authData.user.id,
          receiver_id: partnerId,
          status: 'pending',
          reset_day: resetDay
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast.success(`Request sent to ${selectedPartner}`);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error sending team request:", error);
      toast.error("Failed to send team request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    teamName,
    setTeamName,
    selectedCategory,
    setSelectedCategory,
    selectedPartner,
    setSelectedPartner,
    partnerId,
    setPartnerId,
    frequency,
    setFrequency,
    loading,
    steps,
    currentStepIndex,
    canProceed,
    handleNext,
    handleBack,
    resetForm
  };
};
