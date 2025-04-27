
import React, { useState, useMemo } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Get unique categories from interests
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(interests.map(interest => interest.category))];
    return uniqueCategories;
  }, [interests]);

  // Filter interests by selected category
  const filteredInterests = useMemo(() => {
    if (!selectedCategory) return [];
    return interests.filter(interest => interest.category === selectedCategory);
  }, [interests, selectedCategory]);

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
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interest Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Interest</label>
          <Select
            value={selectedInterests[0] || ""}
            onValueChange={(value) => {
              onToggleInterest(value);
            }}
            disabled={!selectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an interest" />
            </SelectTrigger>
            <SelectContent>
              {filteredInterests.map((interest) => (
                <SelectItem key={interest.id} value={interest.name}>
                  {interest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
