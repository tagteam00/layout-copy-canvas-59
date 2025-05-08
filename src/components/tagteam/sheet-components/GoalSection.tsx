
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TagTeam } from "@/types/tagteam";

interface GoalSectionProps {
  isCurrentUserFirst: boolean;
  tagTeam: TagTeam;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
}

export const GoalSection: React.FC<GoalSectionProps> = ({
  isCurrentUserFirst,
  tagTeam,
  showCalendar,
  setShowCalendar
}) => {
  const [activeGoal, setActiveGoal] = useState<string>("your");
  
  // Determine current user and partner based on isCurrentUserFirst
  const currentUser = isCurrentUserFirst ? tagTeam.firstUser : tagTeam.secondUser;
  const partnerUser = isCurrentUserFirst ? tagTeam.secondUser : tagTeam.firstUser;
  
  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  // Handler for setting a new goal
  const handleSetGoal = () => {
    console.log("Setting a new goal");
    // Implementation will be added later
  };

  return (
    <>
      {/* Goal Toggle */}
      <div className="flex justify-center mb-4">
        <ToggleGroup 
          type="single" 
          value={activeGoal} 
          onValueChange={(value) => value && setActiveGoal(value)}
          className="gap-2"
        >
          <ToggleGroupItem 
            value="your" 
            className={`min-w-[120px] rounded-full px-5 py-2 border ${activeGoal === "your" 
              ? "bg-[#827AFF] text-black border-[#827AFF]" 
              : "bg-white text-black border-[#827AFF]"}`}
          >
            Your Goal
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="partner" 
            className={`min-w-[120px] rounded-full px-5 py-2 border ${activeGoal === "partner" 
              ? "bg-[#827AFF] text-black border-[#827AFF]" 
              : "bg-white text-black border-[#827AFF]"}`}
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
                onClick={handleSetGoal}
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
