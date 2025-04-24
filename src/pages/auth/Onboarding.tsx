
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/onboarding/PersonalInfoForm";
import { InterestsSelector } from "@/components/onboarding/InterestsSelector";
import { CommitmentSelector } from "@/components/onboarding/CommitmentSelector";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { useUserData } from "@/hooks/useUserData";
import type { UserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const commitmentLevels = [
  { value: "casual", label: "Casual", description: "Relaxed approach with flexible schedules" },
  { value: "committed", label: "Committed", description: "Consistent engagement with regular check-ins" },
  { value: "fun", label: "Fun", description: "Social and enjoyable activities without pressure" }
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();
  const { saveUserData } = useUserData();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<UserData>({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    interests: [],
    commitmentLevel: ""
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Please sign in to continue");
        navigate("/signin");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handlePersonalInfoSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prevInterests =>
      prevInterests.includes(interest)
        ? prevInterests.filter(i => i !== interest)
        : [...prevInterests, interest]
    );
  };

  const handleInterestsSubmit = () => {
    setFormData({ ...formData, interests: selectedInterests });
    setStep(3);
  };

  const handleCommitmentSubmit = async (level: string) => {
    try {
      setLoading(true);
      const finalFormData = { ...formData, commitmentLevel: level };
      
      const success = await saveUserData(finalFormData);
      
      if (success) {
        toast.success("Profile saved successfully!");
        navigate("/");
      } else {
        toast.error("Failed to save profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-black">Let's set up your profile</h1>
          <StepIndicator currentStep={step} totalSteps={3} />
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 1 && (
              <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
            )}

            {step === 2 && (
              <InterestsSelector
                selectedInterests={selectedInterests}
                onToggleInterest={toggleInterest}
                onNext={handleInterestsSubmit}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <CommitmentSelector
                commitmentLevels={commitmentLevels}
                selectedCommitment={formData.commitmentLevel}
                onCommitmentSelect={(level) => setFormData({ ...formData, commitmentLevel: level })}
                onComplete={() => handleCommitmentSubmit(formData.commitmentLevel)}
                onBack={() => setStep(2)}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
