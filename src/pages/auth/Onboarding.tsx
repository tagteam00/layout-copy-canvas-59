
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/onboarding/PersonalInfoForm";
import { InterestsSelector } from "@/components/onboarding/InterestsSelector";
import { CommitmentSelector } from "@/components/onboarding/CommitmentSelector";
import { LocationStep } from "@/components/onboarding/LocationStep";
import { BioStep } from "@/components/onboarding/BioStep";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { useUserData } from "@/hooks/useUserData";
import type { UserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, updateOnboardingStatus } = useAuth();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<UserData>({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    interests: [],
    commitmentLevel: "",
    city: "",
    country: "",
    bio: ""
  });

  // If no user is authenticated, don't render the form
  if (!user) {
    return null; // The auth routing will handle redirecting to login
  }

  const handlePersonalInfoSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests([interest]);
  };

  const handleInterestsSubmit = () => {
    setFormData({ ...formData, interests: selectedInterests });
    setStep(3);
  };

  const handleCommitmentSubmit = (level: string) => {
    setFormData({ ...formData, commitmentLevel: level });
    setStep(4);
  };

  const handleLocationSubmit = (locationData: { city: string; state: string }) => {
    setFormData({ 
      ...formData, 
      city: locationData.city,
      country: locationData.state // Using state field for country/state
    });
    setStep(5);
  };

  const handleBioSubmit = async (data: { bio: string, profileImage?: File | null }) => {
    try {
      setLoading(true);
      const finalFormData = { ...formData, bio: data.bio };
      
      // Store profile image if provided
      if (data.profileImage) {
        setProfileImage(data.profileImage);
      }
      
      const success = await saveUserData(finalFormData, data.profileImage || null);
      
      if (success) {
        toast.success("Profile saved successfully!");
        
        // Update onboarding status in the auth context
        if (updateOnboardingStatus) {
          await updateOnboardingStatus(true);
        }
        
        // Navigate to the home page
        navigate("/home", { replace: true });
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
          <StepIndicator currentStep={step} totalSteps={5} />
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
              />
            )}

            {step === 4 && (
              <LocationStep
                onSubmit={handleLocationSubmit}
                onBack={() => setStep(3)}
              />
            )}

            {step === 5 && (
              <BioStep
                onSubmit={handleBioSubmit}
                onBack={() => setStep(4)}
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
