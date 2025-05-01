
import React, { useState } from "react";
import { X, Pencil } from "lucide-react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerClose, 
  DrawerOverlay 
} from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [activeGoal, setActiveGoal] = useState<string>("your");
  const [isSettingGoal, setIsSettingGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
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
  
  return (
    <>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerOverlay />
        <DrawerContent className="bg-white rounded-t-[20px] px-4 py-5 max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col w-full">
            {/* Header */}
            <div className="relative flex items-center justify-center mb-6">
              <h2 className="text-[18px] font-bold text-black">{tagTeam.name}</h2>
              <DrawerClose className="absolute right-0 top-0">
                <X className="h-5 w-5 text-gray-500" />
              </DrawerClose>
            </div>
            
            {/* User Status Section */}
            <div className="bg-[#F8F7FC] rounded-xl p-3 sm:p-4 mb-5">
              <div className="flex justify-between items-start mb-4">
                {/* First User */}
                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <span className="text-[14px] sm:text-[16px] font-medium text-gray-800 text-center">
                    {getFirstName(tagTeam.firstUser.name)}
                  </span>
                  <span className={`py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm font-medium ${
                    tagTeam.firstUser.status === "completed" 
                      ? "bg-[#DCFFDC] text-green-700" 
                      : "bg-[#FFE8CC] text-amber-700"
                  }`}>
                    {tagTeam.firstUser.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </div>

                {/* Reset Timer */}
                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <span className="text-[12px] sm:text-[14px] text-gray-600">
                    Resets in:
                  </span>
                  <span className="text-[14px] sm:text-[16px] font-medium text-blue-500">
                    {tagTeam.resetTime || "00:30:00"}
                  </span>
                </div>

                {/* Second User */}
                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <span className="text-[14px] sm:text-[16px] font-medium text-gray-800 text-center">
                    {getFirstName(tagTeam.secondUser.name)}
                  </span>
                  <span className={`py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm font-medium ${
                    tagTeam.secondUser.status === "completed" 
                      ? "bg-[#DCFFDC] text-green-700" 
                      : "bg-[#FFE8CC] text-amber-700"
                  }`}>
                    {tagTeam.secondUser.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
              
              {/* Team Info */}
              <div className="flex flex-wrap justify-between items-center border-t border-[#E0E0E0] pt-3 sm:pt-4 mb-3 sm:mb-4">
                <div className="mb-2 sm:mb-0">
                  <span className="text-[12px] sm:text-[14px] text-gray-600">Tagteam's Interest: </span>
                  <span className="text-[12px] sm:text-[14px] font-medium text-gray-800">{tagTeam.interest}</span>
                </div>
                <div>
                  <span className="text-[12px] sm:text-[14px] text-gray-600">Frequency: </span>
                  <span className="text-[12px] sm:text-[14px] font-medium text-gray-800">{tagTeam.frequency}</span>
                </div>
              </div>
              
              {/* Goal Toggle */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <ToggleGroup type="single" value={activeGoal} onValueChange={(value) => value && setActiveGoal(value)}>
                  <ToggleGroupItem value="your" className={`w-[90px] sm:w-[100px] text-xs sm:text-sm rounded-full ${activeGoal === "your" ? "bg-[#E5DEFF] text-black" : "bg-white text-gray-500"}`}>
                    Your Goal
                  </ToggleGroupItem>
                  <ToggleGroupItem value="partner" className={`w-[90px] sm:w-[100px] text-xs sm:text-sm rounded-full ${activeGoal === "partner" ? "bg-[#E5DEFF] text-black" : "bg-white text-gray-500"}`}>
                    {getFirstName(partnerUser.name)}'s Goal
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Goal Content */}
              <div className="min-h-[70px] sm:min-h-[80px] p-3 sm:p-4 rounded-md bg-white mb-3 sm:mb-4">
                {activeGoal === "your" ? (
                  currentUser.goal ? (
                    <p className="text-sm sm:text-base text-gray-700">{currentUser.goal}</p>
                  ) : (
                    <div className="flex justify-center">
                      <Button variant="default" className="bg-black text-white text-xs sm:text-sm" onClick={() => setIsSettingGoal(true)}>
                        Set a new goal
                      </Button>
                    </div>
                  )
                ) : (
                  partnerUser.goal ? (
                    <p className="text-sm sm:text-base text-gray-700">{partnerUser.goal}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic text-center">No goal set yet</p>
                  )
                )}
              </div>
            </div>
            
            {/* Calendar Section */}
            <div className="bg-[#F8F7FC] rounded-xl p-3 sm:p-4 mb-5">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-[14px] sm:text-[16px] font-bold">Upcoming:</span>
                <span className="text-[12px] sm:text-[14px] text-gray-600">Tomorrow, Mon</span>
              </div>
              
              <div className="flex justify-between items-center">
                {daysOfWeek.map((day, index) => (
                  <div 
                    key={day} 
                    className={`w-[30px] h-[30px] sm:w-[36px] sm:h-[36px] flex items-center justify-center rounded-full text-xs sm:text-sm ${
                      index === today ? "bg-[#E5DEFF] font-bold" : "bg-[#F0F0F0] text-gray-500"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Partner Verification Section */}
            <div className="mt-auto">
              <p className="text-center text-[14px] sm:text-[16px] font-medium mb-3 sm:mb-4">
                Has {getFirstName(partnerUser.name)} completed {isMobile ? "their" : "his"} Daily goal?
              </p>
              
              <div className="flex justify-between gap-3 sm:gap-4">
                <Button 
                  className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF] text-xs sm:text-sm py-2"
                  onClick={() => handleStatusUpdate("pending")}
                >
                  Mark Pending
                </Button>
                <Button 
                  className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC] text-xs sm:text-sm py-2"
                  onClick={() => handleStatusUpdate("completed")}
                >
                  Completed
                </Button>
              </div>
            </div>
            
            {/* Edit goal button positioned at bottom right */}
            {currentUser.goal && activeGoal === "your" && (
              <div className="absolute bottom-8 right-4">
                <Button 
                  size="icon" 
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setNewGoal(currentUser.goal || "");
                    setIsSettingGoal(true);
                  }}
                >
                  <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Goal Setting Dialog */}
      <Dialog open={isSettingGoal} onOpenChange={setIsSettingGoal}>
        <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center">Set Your Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-3 sm:py-4">
            <Textarea
              placeholder="Describe your goal here..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsSettingGoal(false)}
              disabled={isSubmitting}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSetGoal}
              disabled={isSubmitting}
              className="bg-black text-white text-xs sm:text-sm"
            >
              {isSubmitting ? "Saving..." : "Save Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
