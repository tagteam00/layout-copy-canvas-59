
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserStatusSection } from "./UserStatusSection";
import { TeamInfoSection } from "./TeamInfoSection";
import { GoalSection } from "./GoalSection";
import { CalendarSection } from "./CalendarSection";
import { PartnerVerificationSection } from "./PartnerVerificationSection";
import { LeaveTagTeamButton } from "./LeaveTagTeamButton";
import { EditGoalButton } from "./EditGoalButton";
import { SheetHeader } from "./SheetHeader";
import { TagTeam } from "@/types/tagteam";
import { TimerDisplay } from "@/types/tagteam";

interface TagTeamSheetContentProps {
  tagTeam: TagTeam;
  currentUserId: string;
  timer: TimerDisplay;
  timerColorClass: string;
  currentUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
    id: string;
    instagramHandle?: string;
  };
  partnerUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
    id: string;
    instagramHandle?: string;
  };
  activeGoal: string;
  setActiveGoal: (goal: string) => void;
  loadingGoals: boolean;
  needsNewGoal: boolean;
  onSetGoal: () => void;
  onStatusUpdate: (status: "completed" | "pending") => void;
  onClose: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

export const TagTeamSheetContent: React.FC<TagTeamSheetContentProps> = ({
  tagTeam,
  currentUserId,
  timer,
  timerColorClass,
  currentUser,
  partnerUser,
  activeGoal,
  setActiveGoal,
  loadingGoals,
  needsNewGoal,
  onSetGoal,
  onStatusUpdate,
  onClose,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}) => {
  // Check if goal button is visible
  const isEditGoalButtonVisible = currentUser.goal && activeGoal === "your";

  const handleDragStart = (e: React.TouchEvent) => {
    // Only allow drag from header area, not from interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button') || 
                                target.closest('[role="button"]') ||
                                target.closest('input') ||
                                target.closest('textarea') ||
                                target.closest('.touch-none');
    
    if (!isInteractiveElement) {
      handleTouchStart(e);
    }
  };

  const handleDragMove = (e: React.TouchEvent) => {
    // Only handle move if we started a drag from a valid area
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button') || 
                                target.closest('[role="button"]') ||
                                target.closest('input') ||
                                target.closest('textarea') ||
                                target.closest('.touch-none');
    
    if (!isInteractiveElement) {
      handleTouchMove(e);
    }
  };

  const handleDragEnd = (e: React.TouchEvent) => {
    // Only handle end if we started a drag from a valid area
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button') || 
                                target.closest('[role="button"]') ||
                                target.closest('input') ||
                                target.closest('textarea') ||
                                target.closest('.touch-none');
    
    if (!isInteractiveElement) {
      handleTouchEnd(e);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Draggable header area only */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <SheetHeader title={tagTeam.name} />
      </div>
      
      <ScrollArea className="flex-1 px-4 pb-8">
        {/* User Status Section */}
        <div className="rounded-xl p-4 mb-4 mt-4 bg-[#f3f3f3]/[0.48]">
          <UserStatusSection 
            firstUser={tagTeam.firstUser}
            secondUser={tagTeam.secondUser}
            timer={timer}
            timerColorClass={timerColorClass}
          />
          
          <TeamInfoSection 
            interest={tagTeam.interest}
            frequency={tagTeam.frequency}
          />
          
          {loadingGoals ? (
            <div className="min-h-[80px] p-4 rounded-md bg-white mb-4 flex items-center justify-center">
              <p className="text-gray-400">Loading goals...</p>
            </div>
          ) : (
            <GoalSection 
              activeGoal={activeGoal}
              setActiveGoal={setActiveGoal}
              currentUser={currentUser}
              partnerUser={partnerUser}
              onSetGoal={onSetGoal}
              needsNewGoal={needsNewGoal}
            />
          )}
        </div>
        
        <CalendarSection 
          frequency={tagTeam.frequency}
        />
        
        {/* Wrap verification section to prevent drag interference */}
        <div className="touch-none">
          <PartnerVerificationSection 
            partnerName={partnerUser.name}
            partnerId={partnerUser.id}
            userId={currentUserId}
            teamId={tagTeam.id}
            teamName={tagTeam.name}
            onStatusUpdate={onStatusUpdate}
          />
        </div>
        
        {/* Add a subtle divider before the leave button */}
        <div className="mt-8 mb-4 border-t border-gray-100"></div>
        
        {/* Leave Tag Team Button */}
        <div className="touch-none">
          <LeaveTagTeamButton
            tagTeamId={tagTeam.id}
            tagTeamName={tagTeam.name}
            partnerName={partnerUser.name}
            currentUserId={currentUserId}
            onLeaveComplete={onClose}
          />
        </div>
      </ScrollArea>
      
      {/* Edit goal button positioned at bottom right */}
      <EditGoalButton 
        onClick={onSetGoal} 
        visible={isEditGoalButtonVisible} 
      />
    </div>
  );
};
