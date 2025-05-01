import React, { useState, useEffect, useRef } from "react";
import { X, Pencil } from "lucide-react";
import { Drawer, DrawerContent, DrawerClose, DrawerOverlay } from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
interface TagTeamSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tagTeam: {
    id: string;
    name: string;
    firstUser: {
      name: string;
      status: "completed" | "pending";
      goal?: string;
      id: string;
    };
    secondUser: {
      name: string;
      status: "completed" | "pending";
      goal?: string;
      id: string;
    };
    interest: string;
    frequency: string;
    resetTime?: string;
  };
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

  // Determine if current user is first or second user
  const isFirstUser = tagTeam.firstUser.id === currentUserId;
  const currentUser = isFirstUser ? tagTeam.firstUser : tagTeam.secondUser;
  const partnerUser = isFirstUser ? tagTeam.secondUser : tagTeam.firstUser;

  // Days of the week for the calendar section
  const daysOfWeek = ["Su", "Mo", "Tu", "W", "Th", "F", "Sa"];
  const today = new Date().getDay();

  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };
  const handleSetGoal = async () => {
    if (!newGoal.trim()) {
      toast.error("Goal cannot be empty");
      return;
    }
    setIsSubmitting(true);
    try {
      // In a real implementation, you would update the goal in the database
      // and trigger real-time updates for the partner

      // For now, we'll just close the dialog and show a success message
      toast.success("Goal set successfully!");
      setIsSettingGoal(false);
      setNewGoal("");

      // Here you would typically update the local state as well
      // This is a placeholder for where the actual database update would happen
    } catch (error) {
      console.error("Error setting goal:", error);
      toast.error("Failed to set goal");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleStatusUpdate = async (status: "completed" | "pending") => {
    try {
      // In a real implementation, you would update the partner's status in the database
      // and trigger real-time updates

      toast.success(`Partner marked as ${status}`);

      // This is a placeholder for where the actual database update would happen
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
  return <>
      <Drawer open={isOpen} onOpenChange={open => !open && onClose()}>
        <DrawerOverlay />
        <DrawerContent ref={drawerRef} className="bg-white rounded-t-[20px] p-0 transition-all duration-300 ease-in-out" style={{
        height: sheetHeight
      }}>
          {/* Drag handle indicator */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />
          
          <div className="flex flex-col w-full h-full" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
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
                <div className="flex justify-between items-start mb-4">
                  {/* First User */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-[16px] font-medium text-gray-800 text-center">
                      {getFirstName(tagTeam.firstUser.name)}
                    </span>
                    <span className={`py-1 px-3 rounded-full text-sm font-medium ${tagTeam.firstUser.status === "completed" ? "bg-[#DCFFDC] text-green-700" : "bg-[#FFE8CC] text-amber-700"}`}>
                      {tagTeam.firstUser.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>

                  {/* Reset Timer */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-[14px] text-gray-600">
                      Resets in:
                    </span>
                    <span className="text-[16px] font-medium text-blue-500">
                      {tagTeam.resetTime || "00:30:00"}
                    </span>
                  </div>

                  {/* Second User */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-[16px] font-medium text-gray-800 text-center">
                      {getFirstName(tagTeam.secondUser.name)}
                    </span>
                    <span className={`py-1 px-3 rounded-full text-sm font-medium ${tagTeam.secondUser.status === "completed" ? "bg-[#DCFFDC] text-green-700" : "bg-[#FFE8CC] text-amber-700"}`}>
                      {tagTeam.secondUser.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
                
                {/* Team Info */}
                <div className="flex flex-wrap justify-between items-center border-t border-[#E0E0E0] pt-4 mb-4">
                  <div className="mb-2 sm:mb-0">
                    <span className="text-[14px] text-gray-600">Tagteam's Interest: </span>
                    <span className="text-[14px] font-medium text-gray-800">{tagTeam.interest}</span>
                  </div>
                  <div>
                    <span className="text-[14px] text-gray-600">Frequency: </span>
                    <span className="text-[14px] font-medium text-gray-800">{tagTeam.frequency}</span>
                  </div>
                </div>
                
                {/* Goal Toggle */}
                <div className="flex justify-center mb-4">
                  <ToggleGroup type="single" value={activeGoal} onValueChange={value => value && setActiveGoal(value)}>
                    <ToggleGroupItem value="your" className={`w-[100px] rounded-full ${activeGoal === "your" ? "bg-[#E5DEFF] text-black" : "bg-white text-gray-500"}`}>
                      Your Goal
                    </ToggleGroupItem>
                    <ToggleGroupItem value="partner" className={`w-[100px] rounded-full ${activeGoal === "partner" ? "bg-[#E5DEFF] text-black" : "bg-white text-gray-500"}`}>
                      {getFirstName(partnerUser.name)}'s Goal
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {/* Goal Content */}
                <div className="min-h-[80px] p-4 rounded-md bg-white mb-4">
                  {activeGoal === "your" ? currentUser.goal ? <p className="text-gray-700">{currentUser.goal}</p> : <div className="flex justify-center">
                        <Button variant="default" className="bg-black text-white" onClick={() => setIsSettingGoal(true)}>
                          Set a new goal
                        </Button>
                      </div> : partnerUser.goal ? <p className="text-gray-700">{partnerUser.goal}</p> : <p className="text-gray-500 italic text-center">No goal set yet</p>}
                </div>
              </div>
              
              {/* Calendar Section */}
              <div className="bg-[#F8F7FC] rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[16px] font-bold">Upcoming:</span>
                  <span className="text-[14px] text-gray-600">Tomorrow, Mon</span>
                </div>
                
                <div className="flex justify-between items-center px-0 mx-[4px]">
                  {daysOfWeek.map((day, index) => <div key={day} className={`w-[36px] h-[36px] flex items-center justify-center rounded-full ${index === today ? "bg-[#E5DEFF] font-bold" : "bg-[#F0F0F0] text-gray-500"}`}>
                      {day}
                    </div>)}
                </div>
              </div>
              
              {/* Partner Verification Section */}
              <div className="mt-auto mb-6">
                <p className="text-center text-[16px] font-medium mb-4">
                  Has {getFirstName(partnerUser.name)} completed his Daily goal?
                </p>
                
                <div className="flex justify-between gap-4">
                  <Button className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]" onClick={() => handleStatusUpdate("pending")}>
                    Mark Pending
                  </Button>
                  <Button className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]" onClick={() => handleStatusUpdate("completed")}>
                    Completed
                  </Button>
                </div>
              </div>
            </ScrollArea>
            
            {/* Edit goal button positioned at bottom right */}
            {currentUser.goal && activeGoal === "your" && <div className="absolute bottom-10 right-5">
                <Button size="icon" className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300" onClick={() => {
              setNewGoal(currentUser.goal || "");
              setIsSettingGoal(true);
            }}>
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>}
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Goal Setting Dialog */}
      <Dialog open={isSettingGoal} onOpenChange={setIsSettingGoal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Your Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea placeholder="Describe your goal here..." value={newGoal} onChange={e => setNewGoal(e.target.value)} className="min-h-[100px]" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSettingGoal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSetGoal} disabled={isSubmitting} className="bg-black text-white">
              {isSubmitting ? "Saving..." : "Save Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};