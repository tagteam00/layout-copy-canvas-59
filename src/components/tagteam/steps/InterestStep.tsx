
import React from "react";
import { Badge } from "@/components/ui/badge";

interface InterestStepProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const InterestStep: React.FC<InterestStepProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-1">Select Interest</label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedCategory === category
                ? "bg-[rgba(130,122,255,1)]"
                : "hover:bg-[rgba(130,122,255,0.1)]"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};
