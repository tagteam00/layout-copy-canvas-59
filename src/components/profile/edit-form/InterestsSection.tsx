
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InterestsSectionProps {
  interests: string[];
  availableInterests: Array<{ id: string; name: string; category: string }>;
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (interest: string) => void;
}

export const InterestsSection: React.FC<InterestsSectionProps> = ({
  interests,
  availableInterests,
  onAddInterest,
  onRemoveInterest,
}) => {
  const MAX_INTERESTS = 3;
  
  const handleAddInterest = (interest: string) => {
    if (interests.length >= MAX_INTERESTS) {
      toast.error("You can select only 3 interests");
      return;
    }
    onAddInterest(interest);
  };

  const groupedInterests = availableInterests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, typeof availableInterests>);

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Interests</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {interests.map((interest, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onRemoveInterest(interest)}
          >
            {interest} ×
          </Badge>
        ))}
      </div>
      <Select onValueChange={handleAddInterest}>
        <SelectTrigger>
          <SelectValue placeholder="Add an interest" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedInterests).map(([category, categoryInterests]) => (
            <div key={category}>
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              {categoryInterests.map((interest) => (
                <SelectItem
                  key={interest.id}
                  value={interest.name}
                  disabled={interests.includes(interest.name)}
                >
                  {interest.name}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
      {interests.length >= MAX_INTERESTS && (
        <p className="text-xs text-amber-500 mt-1">
          Maximum of 3 interests allowed. Remove an interest to add a new one.
        </p>
      )}
    </div>
  );
};
