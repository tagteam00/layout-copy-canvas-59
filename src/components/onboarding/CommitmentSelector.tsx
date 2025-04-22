
import React from "react";
import { Button } from "@/components/ui/button";

interface CommitmentLevel {
  value: string;
  label: string;
  description: string;
}

interface CommitmentSelectorProps {
  commitmentLevels: CommitmentLevel[];
  selectedCommitment: string;
  onCommitmentSelect: (level: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const CommitmentSelector: React.FC<CommitmentSelectorProps> = ({
  commitmentLevels,
  selectedCommitment,
  onCommitmentSelect,
  onComplete,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Commitment Level</h2>
      <p className="text-gray-600 text-sm">How do you prefer to approach your activities?</p>
      
      <div className="space-y-3">
        {commitmentLevels.map((level) => (
          <div
            key={level.value}
            className={`p-4 border rounded-xl cursor-pointer transition-all ${
              selectedCommitment === level.value 
                ? "border-[rgba(130,122,255,1)] bg-[rgba(130,122,255,0.1)]"
                : "border-gray-200 hover:border-[rgba(130,122,255,0.5)]"
            }`}
            onClick={() => onCommitmentSelect(level.value)}
          >
            <h3 className="font-medium">{level.label}</h3>
            <p className="text-sm text-gray-600">{level.description}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onComplete}
          disabled={!selectedCommitment}
          className="bg-black text-white hover:bg-black/90"
        >
          Complete
        </Button>
      </div>
    </div>
  );
};
