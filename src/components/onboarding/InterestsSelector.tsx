
import React from "react";
import { Button } from "@/components/ui/button";
import { useInterests } from "@/hooks/useInterests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InterestsSelectorProps {
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const InterestsSelector: React.FC<InterestsSelectorProps> = ({
  selectedInterests,
  onToggleInterest,
  onNext,
  onBack,
}) => {
  const { interests, loading, error } = useInterests();

  const groupedInterests = interests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, typeof interests>);

  if (loading) {
    return <div>Loading interests...</div>;
  }

  if (error) {
    return <div>Error loading interests. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Select Your Interest</h2>
      <p className="text-gray-600 text-sm">Choose an activity you want to be accountable for</p>
      
      <div className="space-y-4">
        <Select
          value={selectedInterests[0] || ""}
          onValueChange={(value) => {
            onToggleInterest(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an interest" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(groupedInterests).map(([category, categoryInterests]) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
                {categoryInterests.map((interest) => (
                  <SelectItem key={interest.id} value={interest.name}>
                    {interest.name}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
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
