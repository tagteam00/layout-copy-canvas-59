import React, { useState, useRef } from "react";
import { X, Pencil } from "lucide-react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerClose, 
  DrawerOverlay 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { TagTeam } from "@/types/tagteam";
import { useTagTeamTimer } from "@/hooks/useTagTeamTimer";
import { UserStatusSection } from "./sheet-components/UserStatusSection";
import { TeamInfoSection } from "./sheet-components/TeamInfoSection";
import { GoalSection } from "./sheet-components/GoalSection";
import { CalendarSection } from "./sheet-components/CalendarSection";
import { PartnerVerificationSection } from "./sheet-components/PartnerVerificationSection";
import { GoalDialog } from "./sheet-components/GoalDialog";

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
  const [activeGoal, setActiveGoal] = useState<string>("your");
  const [isSettingGoal, setIsSettingGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sheetHeight, setSheetHeight] = useState<string>("75%");
  const startY = useRef<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Use the timer hook
  const { timer, timerColorClass } = useTagTeamTimer(tagTeam.frequency, tagTeam.resetDay);
  
  // Determine if current user is first or second user
  const isFirstUser = tagTeam.firstUser.id === currentUserId;
  const currentUser = isFirstUser ? tagTeam.firstUser : tagTeam.secondUser;
  const partnerUser = isFirstUser ? tagTeam.secondUser : tagTeam.firstUser;
  
  // Days of the week for the calendar section
  const daysOfWeek = ["Su", "Mo", "Tu", "W", "Th", "F", "Sa"];
  const today = new Date().getDay();
  
  const handleSetGoal = async () => {
    if (!newGoal.trim()) {
      toast.error("Goal cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would update the goal in the database
      toast.success("Goal set successfully!");
      setIsSettingGoal(false);
      setNewGoal("");
    } catch (error) {
      console.error("Error setting goal:", error);
      toast.error("Failed to set goal");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStatusUpdate = async (status: "completed" | "pending") => {
    try {
      toast.success(`Partner marked as ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };
  
  // Touch event handlers for custom drag behavior
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !drawerRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    
    const windowHeight = window.innerHeight;
    const threshold = windowHeight * 0.25; // 25% threshold
    
    // Dragging down
    if (deltaY > 0) {
      // If dragged more than threshold, prepare to close
      if (deltaY > threshold) {
        setSheetHeight("50%");
      } else {
        // Otherwise keep at 75%
        setSheetHeight("75%");
      }
    } 
    // Dragging up - expand to full screen
    else if (deltaY < -50) {
      setSheetHeight("90%");
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startY.current) return;
    
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - startY.current;
    const windowHeight = window.innerHeight;
    const threshold = windowHeight * 0.25; // 25% threshold
    
    // If dragged more than threshold down, close the drawer
    if (deltaY > threshold) {
      onClose();
    } else if (deltaY < -50) {
      // If dragged significantly upward, expand to full
      setSheetHeight("90%");
    } else {
      // Reset to default height
      setSheetHeight("75%");
    }
    
    startY.current = null;
  };
  
  return (
    <>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerOverlay />
        <DrawerContent 
          ref={drawerRef}
          className="bg-white rounded-t-[20px] p-0 transition-all duration-300 ease-in-out"
          style={{ height: sheetHeight }}
        >
          {/* Drag handle indicator */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />
          
          <div 
            className="flex flex-col w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="relative flex items-center justify-center px-4 py-3 border-b border-gray-100">
              <h2 className="text-[20px] font-bold text-black">{tagTeam.name}</h2>
              <DrawerClose className="absolute right-4 top-3">
                <X className="h-6 w-6 text-gray-500" />
              </DrawerClose>
            </div>
            
            {/* Scrollable Content */}
            <ScrollArea className="flex-1 px-4 pb-8">
              {/* User Status Section */}
              <div className="bg-[#F8F7FC] rounded-xl p-4 mb-4 mt-4">
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
                
                <GoalSection 
                  activeGoal={activeGoal}
                  setActiveGoal={setActiveGoal}
                  currentUser={currentUser}
                  partnerUser={partnerUser}
                  onSetGoal={() => setIsSettingGoal(true)}
                />
              </div>
              
              <CalendarSection 
                daysOfWeek={daysOfWeek}
                today={today}
              />
              
              <PartnerVerificationSection 
                partnerName={partnerUser.name}
                onStatusUpdate={handleStatusUpdate}
              />
            </ScrollArea>
            
            {/* Edit goal button positioned at bottom right */}
            {currentUser.goal && activeGoal === "your" && (
              <div className="absolute bottom-10 right-5">
                <Button 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setNewGoal(currentUser.goal || "");
                    setIsSettingGoal(true);
                  }}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
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
      />
    </>
  );
};
