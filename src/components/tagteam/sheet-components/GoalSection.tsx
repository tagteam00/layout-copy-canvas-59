
import React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface GoalSectionProps {
  activeGoal: string;
  setActiveGoal: (value: string) => void;
  currentUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
    id: string;
  };
  partnerUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
    id: string;
  };
  onSetGoal: () => void;
}

export const GoalSection: React.FC<GoalSectionProps> = ({
  activeGoal,
  setActiveGoal,
  currentUser,
  partnerUser,
  onSetGoal
}) => {
  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  return (
    <>
      {/* Goal Toggle */}
      <div className="flex justify-center mb-4">
        <ToggleGroup 
          type="single" 
          value={activeGoal} 
          onValueChange={(value) => value && setActiveGoal(value)}
        >
          <ToggleGroupItem 
            value="your" 
            className={`w-[100px] rounded-full ${activeGoal === "your" ? "bg-[#E5DEFF] text-black" : "bg-white text-gray-500"}`}
          >
            Your Goal
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="partner" 
            className={`w-[100px] rounded-full ${activeGoal === "partner" ? "bg-[#E5DEFF] text-black" : "bg-white text-gray-500"}`}
          >
            {getFirstName(partnerUser.name)}'s Goal
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Goal Content */}
      <div className="min-h-[80px] p-4 rounded-md bg-white mb-4">
        {activeGoal === "your" ? (
          currentUser.goal ? (
            <p className="text-gray-700">{currentUser.goal}</p>
          ) : (
            <div className="flex justify-center">
              <Button 
                variant="default" 
                className="bg-black text-white" 
                onClick={onSetGoal}
              >
                Set a new goal
              </Button>
            </div>
          )
        ) : (
          partnerUser.goal ? (
            <p className="text-gray-700">{partnerUser.goal}</p>
          ) : (
            <p className="text-gray-500 italic text-center">No goal set yet</p>
          )
        )}
      </div>
    </>
  );
};
