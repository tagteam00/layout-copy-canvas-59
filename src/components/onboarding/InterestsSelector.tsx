
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InterestsSelectorProps {
  interests: string[];
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const InterestsSelector: React.FC<InterestsSelectorProps> = ({
  interests,
  selectedInterests,
  onToggleInterest,
  onNext,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Select Your Interests</h2>
      <p className="text-gray-600 text-sm">Choose activities you want to be accountable for</p>
      
      <div className="flex flex-wrap gap-2 my-4">
        {interests.map((interest) => (
          <Badge
            key={interest}
            variant={selectedInterests.includes(interest) ? "default" : "outline"}
            className={`cursor-pointer py-1.5 px-3 ${
              selectedInterests.includes(interest) ? "bg-[rgba(130,122,255,1)]" : ""
            }`}
            onClick={() => onToggleInterest(interest)}
          >
            {interest}
          </Badge>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={selectedInterests.length === 0}
          className="bg-black text-white hover:bg-black/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
