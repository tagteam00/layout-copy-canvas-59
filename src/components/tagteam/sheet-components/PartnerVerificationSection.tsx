
import React, { useState, useEffect } from "react";
import { StatusButtons } from "./verification/StatusButtons";
import { StatusMessage } from "./verification/StatusMessage";
import { usePartnerVerification } from "@/hooks/usePartnerVerification";
import { CongratsDialog } from "@/components/tagteam/CongratsDialog";
import { supabase } from "@/integrations/supabase/client";
import { isCorrectDayForWeeklyLogging, formatCountdownMessage } from "@/utils/weeklyUtils";

interface PartnerVerificationSectionProps {
  partnerName: string;
  partnerId: string;
  userId: string;
  teamId: string;
  teamName?: string;
  frequency: string;
  resetDay?: string;
  onStatusUpdate: (status: "completed" | "pending") => void;
}

export const PartnerVerificationSection: React.FC<PartnerVerificationSectionProps> = ({
  partnerName,
  partnerId,
  userId,
  teamId,
  teamName = "TagTeam",
  frequency,
  resetDay,
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
          
          // Ensure the status is properly typed
          const status = data.status as "completed" | "pending";
          setUserLoggedStatus(status);
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
    await handleStatusChange("pending");
    setUserLoggedStatus("pending");
    onStatusUpdate("pending");
  };

  const handleMarkCompleted = async () => {
    await handleStatusChange("completed");
    setUserLoggedStatus("completed");
    onStatusUpdate("completed");
  };

  const getFrequencyText = () => {
    // Return the actual frequency text
    return frequency || "Daily";
  };

  // Check if today is the correct day for weekly logging
  const canLogToday = isCorrectDayForWeeklyLogging(frequency, resetDay);
  const countdownMessage = !canLogToday ? formatCountdownMessage(frequency, resetDay) : '';

  return (
    <div className="mt-auto mb-6">
      {!canLogToday ? (
        // Show countdown message for weekly teams on wrong days
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
          <div className="text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Activity Not Due Today</h3>
            <p className="text-blue-700 text-sm">{countdownMessage}</p>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
      
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
