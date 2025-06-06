
import React from "react";
import { CreateTeamStep } from "@/types/tagteam";
import { NameStep } from "../steps/NameStep";
import { InterestStep } from "../steps/InterestStep";
import { PartnerStep } from "../steps/PartnerStep";
import { FrequencyStep } from "../steps/FrequencyStep";

interface CreateTeamStepContentProps {
  currentStep: CreateTeamStep;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setSelectedPartner: (partner: string) => void;
  setPartnerId: (id: string) => void;
  frequency: { type: 'daily' | 'weekly'; day?: string };
  setFrequency: (frequency: { type: 'daily' | 'weekly'; day?: string }) => void;
  teamName: string;
  setTeamName: (name: string) => void;
}

export const CreateTeamStepContent: React.FC<CreateTeamStepContentProps> = ({
  currentStep,
  categories,
  selectedCategory,
  setSelectedCategory,
  setSelectedPartner,
  setPartnerId,
  frequency,
  setFrequency,
  teamName,
  setTeamName
}) => {
  switch (currentStep) {
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
