
import { useState, useEffect } from "react";
import { 
  logPartnerActivity, 
  hasActiveActivityLog,
  checkTeamGoalCompletion 
} from "@/services/activities";
import { closeTeamActivityCycle } from "@/services/activities/cycleManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createGoalCompletedNotification } from "@/services/notificationService";

export interface PartnerVerificationProps {
  teamId: string;
  userId: string;
  partnerId: string;
  teamName: string;
  partnerName: string;
}

export const usePartnerVerification = ({
  teamId,
  userId,
  partnerId,
  teamName,
  partnerName
}: PartnerVerificationProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasLoggedActivity, setHasLoggedActivity] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);

  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  // Check if user has already logged an activity for this partner
  const checkExistingActivity = async () => {
    try {
      // Close any expired cycles first to ensure fresh status
      await closeTeamActivityCycle(teamId);
      
      const hasActivity = await hasActiveActivityLog(teamId, userId, partnerId);
      setHasLoggedActivity(hasActivity);
    } catch (error) {
      console.error("Error checking for existing activity log:", error);
    }
  };

  useEffect(() => {
    if (teamId && userId && partnerId) {
      checkExistingActivity();
    }
  }, [teamId, userId, partnerId]);

  // Setup real-time subscription to team activities
  useEffect(() => {
    if (!teamId) return;
    
    const channel = supabase
      .channel(`team-activities-verification-${teamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_activities',
          filter: `team_id=eq.${teamId}`
        },
        async (payload) => {
          // If a new activity is logged for this team where the current user logged it
          if (payload.new && 
              payload.new.logged_by_user_id === userId &&
              payload.new.verified_user_id === partnerId) {
            setHasLoggedActivity(true);
            
            // Check if this activity completes the goal (both users marked each other as completed)
            if (payload.new.status === "completed") {
              try {
                const isGoalCompleted = await checkTeamGoalCompletion(teamId, userId, partnerId);
                if (isGoalCompleted) {
                  // Show congratulations dialog for the current user who just completed the activity
                  setShowCongrats(true);
                  
                  // Send notifications to both users
                  await createGoalCompletedNotification(
                    userId,
                    partnerId,
                    teamName,
                    teamId
                  );
                }
              } catch (err) {
                console.error("Error checking goal completion:", err);
              }
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'team_activities',
          filter: `team_id=eq.${teamId}`
        },
        async () => {
          // When activities are updated (cycle closure), refresh the verification status
          console.log('Activity cycle updated, refreshing verification status');
          await checkExistingActivity();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, userId, partnerId, teamName]);

  // Handle status change
  const handleStatusChange = async (status: "completed" | "pending") => {
    try {
      setIsSubmitting(true);
      
      // Get team name if not provided
      let actualTeamName = teamName;
      if (!actualTeamName) {
        const { data: teamData } = await supabase
          .from('teams')
          .select('name')
          .eq('id', teamId)
          .single();
          
        actualTeamName = teamData?.name || "TagTeam";
      }
      
      // Log the partner's activity status with notification details
      await logPartnerActivity(
        teamId,
        userId,      // logged by current user
        partnerId,   // verifying partner's status
        status,
        actualTeamName,
        getFirstName(partnerName)
      );
      
      setHasLoggedActivity(true);
      
      toast.success(`${getFirstName(partnerName)}'s status marked as ${status}`);
      
      // Check if this action completes the goal
      if (status === "completed") {
        try {
          const isGoalCompleted = await checkTeamGoalCompletion(teamId, userId, partnerId);
          if (isGoalCompleted) {
            // Show congratulations dialog for the current user who just completed the activity
            setShowCongrats(true);
            
            // Send notifications to both users
            await createGoalCompletedNotification(
              userId,
              partnerId,
              actualTeamName,
              teamId
            );
          }
        } catch (err) {
          console.error("Error checking goal completion:", err);
        }
      }
      
      return status;
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to update ${getFirstName(partnerName)}'s status`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    hasLoggedActivity,
    showCongrats,
    setShowCongrats,
    handleStatusChange,
    getFirstName
  };
};
