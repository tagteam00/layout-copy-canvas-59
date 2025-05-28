
import React, { useState, useEffect } from "react";
import { StatusButtons } from "./verification/StatusButtons";
import { StatusMessage } from "./verification/StatusMessage";
import { usePartnerVerification } from "@/hooks/usePartnerVerification";
import { CongratsDialog } from "@/components/tagteam/CongratsDialog";
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
  teamName = "TagTeam",
  onStatusUpdate
}) => {
  const [userLoggedStatus, setUserLoggedStatus] = useState<"completed" | "pending" | null>(null);

  const {
    isSubmitting,
    hasLoggedActivity,
    showCongrats,
    setShowCongrats,
    handleStatusChange,
    getFirstName
  } = usePartnerVerification({
    teamId,
    userId,
    partnerId,
    teamName,
    partnerName
  });

  // Fetch the user's logged status when component mounts or when hasLoggedActivity changes
  useEffect(() => {
    const fetchUserLoggedStatus = async () => {
      if (hasLoggedActivity) {
        try {
          const { data, error } = await supabase
            .from('team_activities')
            .select('status')
            .eq('team_id', teamId)
            .eq('logged_by_user_id', userId)
            .eq('verified_user_id', partnerId)
            .is('cycle_end', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;
          setUserLoggedStatus(data.status);
        } catch (error) {
          console.error('Error fetching user logged status:', error);
        }
      } else {
        setUserLoggedStatus(null);
      }
    };

    fetchUserLoggedStatus();
  }, [hasLoggedActivity, teamId, userId, partnerId]);

  const handleMarkPending = async () => {
    const status = await handleStatusChange("pending");
    setUserLoggedStatus("pending");
    onStatusUpdate(status);
  };

  const handleMarkCompleted = async () => {
    const status = await handleStatusChange("completed");
    setUserLoggedStatus("completed");
    onStatusUpdate(status);
  };

  const getFrequencyText = () => {
    // Get activity frequency from the team data
    // Default to "Daily" if not available
    return "Daily";
  };

  return (
    <div className="mt-auto mb-6">
      <StatusMessage 
        partnerFirstName={getFirstName(partnerName)}
        hasLoggedActivity={hasLoggedActivity}
        frequencyText={getFrequencyText()}
        userLoggedStatus={userLoggedStatus}
      />
      
      <StatusButtons 
        onMarkPending={handleMarkPending}
        onMarkCompleted={handleMarkCompleted}
        isSubmitting={isSubmitting}
        isDisabled={hasLoggedActivity}
        showButtons={!hasLoggedActivity}
      />
      
      {/* Congratulations Dialog */}
      <CongratsDialog 
        isOpen={showCongrats} 
        onOpenChange={setShowCongrats}
        teamName={teamName}
        partnerName={partnerName}
      />
    </div>
  );
};
