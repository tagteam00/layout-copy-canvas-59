
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logPartnerActivity, hasActiveActivityLog } from "@/services/activityService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PartnerVerificationSectionProps {
  partnerName: string;
  partnerId: string;
  userId: string;
  teamId: string;
  teamName?: string;
  onStatusUpdate: (status: "completed" | "pending") => void;
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  partnerName,
  partnerId,
  userId,
  teamId,
  teamName,
  onStatusUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasLoggedActivity, setHasLoggedActivity] = useState<boolean>(false);

  // Check if user has already logged an activity for this partner
  useEffect(() => {
    const checkExistingActivity = async () => {
      try {
        const hasActivity = await hasActiveActivityLog(teamId, userId, partnerId);
        setHasLoggedActivity(hasActivity);
      } catch (error) {
        console.error("Error checking for existing activity log:", error);
      }
    };
    
    if (teamId && userId && partnerId) {
      checkExistingActivity();
    }
    
    // Listen for real-time updates to team activities
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
        (payload) => {
          // If a new activity is logged for this team where the current user logged it
          if (payload.new && 
              payload.new.logged_by_user_id === userId &&
              payload.new.verified_user_id === partnerId) {
            setHasLoggedActivity(true);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, userId, partnerId]);

  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

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
      
      onStatusUpdate(status);
      setHasLoggedActivity(true);
      
      toast.success(`${getFirstName(partnerName)}'s status marked as ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to update ${getFirstName(partnerName)}'s status`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-auto mb-6">
      <p className="text-center text-[16px] font-medium mb-4">
        Has {getFirstName(partnerName)} completed his Daily goal?
      </p>
      
      <div className="flex justify-between gap-4">
        <Button 
          className="flex-1 bg-[#FFDFDF] text-red-700 hover:bg-[#FFCFCF]"
          onClick={() => handleStatusChange("pending")}
          disabled={isSubmitting || hasLoggedActivity}
        >
          Mark Pending
        </Button>
        <Button 
          className="flex-1 bg-[#DCFFDC] text-green-700 hover:bg-[#CCFFCC]"
          onClick={() => handleStatusChange("completed")}
          disabled={isSubmitting || hasLoggedActivity}
        >
          Completed
        </Button>
      </div>
      
      {hasLoggedActivity && (
        <p className="text-center text-gray-500 text-sm mt-3">
          You've already verified {getFirstName(partnerName)}'s status for this cycle.
        </p>
      )}
    </div>
  );
};
