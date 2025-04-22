
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/onboarding/PersonalInfoForm";
import { InterestsSelector } from "@/components/onboarding/InterestsSelector";
import { CommitmentSelector } from "@/components/onboarding/CommitmentSelector";
import { StepIndicator } from "@/components/onboarding/StepIndicator";

const interests = [
  "Swimming",
  "Gym",
  "Football",
  "Running",
  "Yoga",
  "Cycling",
  "Meditation",
  "Reading",
  "Cooking",
  "Hiking"
];

const commitmentLevels = [
  { value: "casual", label: "Casual", description: "Relaxed approach with flexible schedules" },
  { value: "committed", label: "Committed", description: "Consistent engagement with regular check-ins" },
  { value: "fun", label: "Fun", description: "Social and enjoyable activities without pressure" }
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    interests: [] as string[],
    commitmentLevel: ""
  });

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

  const handleCommitmentSubmit = (level: string) => {
    const finalFormData = { ...formData, commitmentLevel: level };
    console.log("Complete form data:", finalFormData);
    navigate("/");
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
                interests={interests}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
