
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GoalSectionProps {
  activeGoal: string;
  setActiveGoal: (goal: string) => void;
  currentUser: {
    name: string;
    goal?: string;
  };
  partnerUser: {
    name: string;
    goal?: string;
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
  // Add safety check for user names
  const getUserFirstName = (user: { name?: string }) => {
    if (!user || !user.name) return "User";
    return user.name.split(" ")[0];
  };

  const currentUserFirstName = getUserFirstName(currentUser);
  const partnerUserFirstName = getUserFirstName(partnerUser);

  return (
    <div className="bg-white p-4 rounded-md mb-4">
      <h2 className="text-[16px] font-bold mb-2">Goals</h2>
      <Tabs defaultValue="your" value={activeGoal} onValueChange={setActiveGoal} className="mb-3">
        <TabsList className="grid grid-cols-2 mb-3 bg-gray-100">
          <TabsTrigger value="your" className={activeGoal === "your" ? "font-medium" : ""}>
            Your Goal
          </TabsTrigger>
          <TabsTrigger value="partner" className={activeGoal === "partner" ? "font-medium" : ""}>
            {partnerUserFirstName}'s Goal
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeGoal === "your" ? (
        currentUser.goal ? (
          <div className="text-[14px] text-gray-700 bg-slate-50 p-3 rounded-md">
            {currentUser.goal}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3">
            <p className="text-gray-400 mb-3">No goal set yet</p>
            <Button 
              onClick={onSetGoal}
              className="bg-black hover:bg-gray-900 text-white px-4 py-1 rounded-md"
            >
              Set Goal
            </Button>
          </div>
        )
      ) : (
        partnerUser.goal ? (
          <div className="text-[14px] text-gray-700 bg-slate-50 p-3 rounded-md">
            {partnerUser.goal}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3">
            <p className="text-gray-400">{partnerUserFirstName} hasn't set a goal yet</p>
          </div>
        )
      )}
    </div>
  );
};
