
import { useState, useEffect } from "react";
import { fetchTeamGoal, createTeamGoal, updateTeamGoal } from "@/services/goalService";
import { closeTeamGoalCycle } from "@/services/activities/cycleManagement";
import { toast } from "sonner";

export const useTagTeamGoals = (
  isOpen: boolean,
  teamId: string,
  userId: string,
  partnerId: string,
  hasResetOccurred: boolean,
  acknowledgeReset: () => void
) => {
  const [activeGoal, setActiveGoal] = useState<string>("your");
  const [isSettingGoal, setIsSettingGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentUserGoal, setCurrentUserGoal] = useState<string | undefined>(undefined);
  const [partnerUserGoal, setPartnerUserGoal] = useState<string | undefined>(undefined);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [loadingGoals, setLoadingGoals] = useState<boolean>(true);
  const [needsNewGoal, setNeedsNewGoal] = useState<boolean>(false);

  const handleResetGoals = async () => {
    try {
      console.log(`Timer reset detected - closing goal cycles for team ${teamId}`);
      
      // Close expired goal cycles for this team
      const goalsClosed = await closeTeamGoalCycle(teamId);
      
      if (goalsClosed > 0) {
        console.log(`Closed ${goalsClosed} expired goal cycles`);
        // Reset local goal state
        setCurrentUserGoal(undefined);
        setGoalId(null);
        setNeedsNewGoal(true);
        toast.info("A new cycle has started! Set your new goal for this cycle.");
      }

      // Acknowledge the timer reset
      acknowledgeReset();
    } catch (error) {
      console.error("Error handling goal reset:", error);
      // Still acknowledge reset even if goal closure fails
      acknowledgeReset();
    }
  };

  const loadGoals = async () => {
    setLoadingGoals(true);
    try {
      // First, check and close any expired goal cycles before loading
      await closeTeamGoalCycle(teamId);
      
      // Fetch current user's goal
      const userGoal = await fetchTeamGoal(teamId, userId);
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
      const partnerGoal = await fetchTeamGoal(teamId, partnerId);
      setPartnerUserGoal(partnerGoal?.goal || undefined);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to load goals");
    } finally {
      setLoadingGoals(false);
    }
  };
  
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
        const result = await createTeamGoal(teamId, userId, newGoal);
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

  // Fetch goals when the sheet opens
  useEffect(() => {
    if (isOpen && teamId) {
      loadGoals();
    }
  }, [isOpen, teamId]);

  // Handle timer resets - this is the key integration point
  useEffect(() => {
    if (isOpen && hasResetOccurred) {
      console.log("Timer reset detected in useTagTeamGoals - handling goal reset");
      handleResetGoals();
    }
  }, [isOpen, hasResetOccurred, teamId]);

  // Check if a goal needs to be set - either it's a new cycle or there's no goal yet
  useEffect(() => {
    if (isOpen && !loadingGoals && !currentUserGoal) {
      setNeedsNewGoal(true);
    }
  }, [isOpen, loadingGoals, currentUserGoal]);

  // Auto-open goal dialog if user needs to set a new goal
  useEffect(() => {
    if (isOpen && needsNewGoal && !isSettingGoal && !loadingGoals) {
      // Slight delay to ensure the sheet is visible first
      const timer = setTimeout(() => {
        openGoalDialog();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, needsNewGoal, isSettingGoal, loadingGoals]);

  return {
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
  };
};
