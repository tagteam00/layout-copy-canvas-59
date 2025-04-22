
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  loading?: boolean;
}

export const CommitmentSelector: React.FC<CommitmentSelectorProps> = ({
  commitmentLevels,
  selectedCommitment,
  onCommitmentSelect,
  onComplete,
  onBack,
  loading = false
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Select Commitment Level</h2>
      
      <RadioGroup
        value={selectedCommitment}
        onValueChange={onCommitmentSelect}
        className="space-y-3"
      >
        {commitmentLevels.map((level) => (
          <Card key={level.value} className={`p-4 cursor-pointer border ${selectedCommitment === level.value ? 'border-[#827AFF]' : 'border-gray-200'}`}>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value={level.value} id={level.value} />
              <div className="space-y-1">
                <Label htmlFor={level.value} className="text-base font-medium">
                  {level.label}
                </Label>
                <p className="text-sm text-gray-500">{level.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button 
          onClick={onComplete} 
          className="bg-black text-white hover:bg-black/90" 
          disabled={!selectedCommitment || loading}
        >
          {loading ? "Saving..." : "Complete"}
        </Button>
      </div>
    </div>
  );
};
