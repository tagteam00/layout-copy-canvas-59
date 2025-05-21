
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { 
  fetchTeamGoal, 
  createTeamGoal, 
  updateTeamGoal, 
  closeAllActiveGoals 
} from "@/services/goalService";

export const useTagTeamSheetState = (tagTeamId: string, currentUserId: string, partnerId: string) => {
  const [activeGoal, setActiveGoal] = useState<string>("your");
  const [isSettingGoal, setIsSettingGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // State for user's goal data
  const [currentUserGoal, setCurrentUserGoal] = useState<string | undefined>(undefined);
  const [partnerUserGoal, setPartnerUserGoal] = useState<string | undefined>(undefined);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [loadingGoals, setLoadingGoals] = useState<boolean>(true);
  const [needsNewGoal, setNeedsNewGoal] = useState<boolean>(false);

  // Sheet height management
  const [sheetHeight, setSheetHeight] = useState<string>("75%");
  const startY = useRef<number | null>(null);

  // Load goals function
  const loadGoals = async () => {
    setLoadingGoals(true);
    try {
      // Fetch current user's goal
      const userGoal = await fetchTeamGoal(tagTeamId, currentUserId);
      if (userGoal) {
        setCurrentUserGoal(userGoal.goal);
        setGoalId(userGoal.id);
        setNeedsNewGoal(false);
      } else {
        setCurrentUserGoal(undefined);
        setGoalId(null);
        setNeedsNewGoal(true);
      }
      
      // Fetch partner's goal
      const partnerGoal = await fetchTeamGoal(tagTeamId, partnerId);
      setPartnerUserGoal(partnerGoal?.goal || undefined);
      
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to load goals");
    } finally {
      setLoadingGoals(false);
    }
  };
  
  // Handle goal resets
  const handleResetGoals = async () => {
    try {
      // Close current goal cycle
      if (goalId) {
        await closeAllActiveGoals(tagTeamId, currentUserId);
        setCurrentUserGoal(undefined);
        setGoalId(null);
        setNeedsNewGoal(true);
        toast.info("A new cycle has started! Set your new goal for this cycle.");
      }
    } catch (error) {
      console.error("Error handling goal reset:", error);
    }
  };
  
  // Set goal function
  const handleSetGoal = async () => {
    if (!newGoal.trim()) {
      toast.error("Goal cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (goalId) {
        // Update existing goal
        await updateTeamGoal(goalId, newGoal);
      } else {
        // Create new goal
        const result = await createTeamGoal(tagTeamId, currentUserId, newGoal);
        if (result) {
          setGoalId(result.id);
        }
      }
      
      setCurrentUserGoal(newGoal);
      setNeedsNewGoal(false);
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

  const openGoalDialog = () => {
    setNewGoal(currentUserGoal || "");
    setIsSettingGoal(true);
  };
  
  // Status update handler
  const handleStatusUpdate = async (status: "completed" | "pending") => {
    try {
      toast.success(`Partner marked as ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return {
    // States
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
    sheetHeight,
    startY,
    
    // Methods
    loadGoals,
    handleResetGoals,
    handleSetGoal,
    openGoalDialog,
    handleStatusUpdate,
    setSheetHeight
  };
};
