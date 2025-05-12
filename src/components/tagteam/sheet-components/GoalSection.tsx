
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

interface GoalSectionProps {
  activeGoal: string;
  setActiveGoal: React.Dispatch<React.SetStateAction<string>>;
  currentUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
  };
  partnerUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
  };
  onSetGoal: () => void;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GoalSection: React.FC<GoalSectionProps> = ({
  activeGoal,
  setActiveGoal,
  currentUser,
  partnerUser,
  onSetGoal,
  showCalendar,
  setShowCalendar
}) => {
  // Get the first name only for display
  const getFirstName = (fullName: string | undefined): string => {
    if (!fullName) return "User";
    return fullName.split(' ')[0];
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[16px] font-bold">Goals:</span>
        </div>
        <button 
          className={`flex items-center gap-1 text-sm ${showCalendar ? 'text-purple-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <CalendarDays className="w-4 h-4" />
          {showCalendar ? 'Hide Calendar' : 'View Calendar'}
        </button>
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="flex bg-gray-200 rounded-full overflow-hidden">
          <button
            className={`py-1 px-4 text-sm text-center transition-colors ${
              activeGoal === "your" 
                ? "bg-black text-white" 
                : "bg-transparent text-gray-600"
            }`}
            onClick={() => setActiveGoal("your")}
          >
            Your Goal
          </button>
          <button
            className={`py-1 px-4 text-sm text-center transition-colors ${
              activeGoal === "partner" 
                ? "bg-black text-white" 
                : "bg-transparent text-gray-600"
            }`}
            onClick={() => setActiveGoal("partner")}
          >
            {getFirstName(partnerUser.name)}'s Goal
          </button>
        </div>
      </div>
      
      <div className="min-h-[80px] p-4 rounded-md bg-white mb-4 overflow-auto">
        {activeGoal === "your" ? (
          currentUser.goal ? (
            <p className="text-[14px]">{currentUser.goal}</p>
          ) : (
            <div className="text-center h-full flex flex-col items-center justify-center">
              <p className="text-gray-500 mb-2">You haven't set a goal yet</p>
              <Button 
                variant="outline" 
                className="text-xs px-3 py-1 h-auto"
                onClick={onSetGoal}
              >
                Set Goal
              </Button>
            </div>
          )
        ) : (
          partnerUser.goal ? (
            <p className="text-[14px]">{partnerUser.goal}</p>
          ) : (
            <p className="text-gray-500 text-center">{getFirstName(partnerUser.name)} hasn't set a goal yet</p>
          )
        )}
      </div>
    </div>
  );
};
