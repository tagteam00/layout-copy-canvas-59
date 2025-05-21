
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import { TagTeam } from "@/types/tagteam";
import { useTagTeamTimer } from "@/hooks/useTagTeamTimer";
import { GoalDialog } from "./sheet-components/GoalDialog";
import { CongratsDialog } from "./CongratsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useTagTeamSheetDrag } from "@/hooks/useTagTeamSheetDrag";
import { TagTeamSheetContent } from "./sheet-components/TagTeamSheetContent";
import { useTagTeamNotifications } from "@/hooks/useTagTeamNotifications";
import { useTagTeamGoals } from "@/hooks/useTagTeamGoals";
import { toast } from "sonner";
import { useEffect } from "react";

interface TagTeamSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tagTeam: TagTeam;
  currentUserId: string;
}

export const TagTeamSheet: React.FC<TagTeamSheetProps> = ({
  isOpen,
  onClose,
  tagTeam,
  currentUserId
}) => {
  // Sheet height state
  const [sheetHeight, setSheetHeight] = useState<string>("75%");
  
  // Configure sheet drag behavior
  const {
    drawerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useTagTeamSheetDrag(setSheetHeight, onClose);

  // Determine if current user is first or second user
  const isFirstUser = tagTeam.firstUser.id === currentUserId;
  
  // Partner status state
  const [partnerStatus, setPartnerStatus] = useState<"completed" | "pending">(
    isFirstUser ? tagTeam.secondUser.status : tagTeam.firstUser.status
  );

  // Prepare user objects
  const currentUser = {
    ...(isFirstUser ? tagTeam.firstUser : tagTeam.secondUser)
  };
  
  const partnerUser = {
    ...(isFirstUser ? tagTeam.secondUser : tagTeam.firstUser)
  };
  
  const partnerId = isFirstUser ? tagTeam.secondUser.id : tagTeam.firstUser.id;

  // Use the enhanced timer hook with team info for notifications
  const {
    timer,
    timerColorClass,
    hasResetOccurred,
    acknowledgeReset
  } = useTagTeamTimer(tagTeam.frequency, tagTeam.resetDay, tagTeam.id, currentUserId, tagTeam.name);

  // Use the notification management hook
  const { 
    showCongrats, 
    setShowCongrats 
  } = useTagTeamNotifications(isOpen, tagTeam.id, currentUserId);
  
  // Use the goal management hook
  const {
    activeGoal,
    setActiveGoal,
    isSettingGoal,
    setIsSettingGoal,
    newGoal,
    setNewGoal,
    isSubmitting,
    currentUserGoal,
    partnerUserGoal,
    loadingGoals,
    needsNewGoal,
    handleSetGoal,
    openGoalDialog
  } = useTagTeamGoals(
    isOpen,
    tagTeam.id,
    currentUserId,
    partnerId,
    hasResetOccurred,
    acknowledgeReset
  );

  // Subscribe to real-time updates for team activities
  useEffect(() => {
    if (!isOpen || !tagTeam.id) return;

    // Subscribe to changes in team_activities table for this team
    const channel = supabase.channel(`team-activities-${tagTeam.id}`).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'team_activities',
      filter: `team_id=eq.${tagTeam.id}`
    }, payload => {
      console.log('Activity update:', payload);
      // Call onClose to refresh data when reopening
      onClose();
      toast.info("Partner activity status updated");
    }).subscribe();
    
    return () => {
      // Clean up subscription on unmount or when sheet closes
      supabase.removeChannel(channel);
    };
  }, [isOpen, tagTeam.id, onClose]);

  // Update partner status handler
  const handleStatusUpdate = async (status: "completed" | "pending") => {
    setPartnerStatus(status);
  };
  
  // Update user objects with goals
  const currentUserWithGoal = {
    ...currentUser,
    goal: currentUserGoal
  };
  
  const partnerUserWithGoal = {
    ...partnerUser,
    goal: partnerUserGoal
  };
  
  return (
    <>
      <Drawer open={isOpen} onOpenChange={open => !open && onClose()}>
        <DrawerOverlay />
        <DrawerContent 
          ref={drawerRef} 
          className="bg-white rounded-t-[20px] p-0 transition-all duration-300 ease-in-out" 
          style={{ height: sheetHeight }}
        >
          {/* Drag handle indicator */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />
          
          <TagTeamSheetContent
            tagTeam={tagTeam}
            currentUserId={currentUserId}
            timer={timer}
            timerColorClass={timerColorClass}
            currentUser={currentUserWithGoal}
            partnerUser={partnerUserWithGoal}
            activeGoal={activeGoal}
            setActiveGoal={setActiveGoal}
            loadingGoals={loadingGoals}
            needsNewGoal={needsNewGoal}
            onSetGoal={openGoalDialog}
            onStatusUpdate={handleStatusUpdate}
            onClose={onClose}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
          />
        </DrawerContent>
      </Drawer>
      
      {/* Goal Setting Dialog */}
      <GoalDialog 
        isOpen={isSettingGoal} 
        onOpenChange={setIsSettingGoal} 
        newGoal={newGoal} 
        setNewGoal={setNewGoal} 
        onSave={handleSetGoal} 
        isSubmitting={isSubmitting} 
        cycleType={tagTeam.frequency.toLowerCase().includes("daily") ? "daily" : "weekly"} 
      />
      
      {/* Congratulations Dialog */}
      <CongratsDialog 
        isOpen={showCongrats}
        onOpenChange={setShowCongrats}
        teamName={tagTeam.name}
        partnerName={partnerUserWithGoal.name}
      />
    </>
  );
};
