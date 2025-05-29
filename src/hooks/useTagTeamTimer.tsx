
import { useState, useEffect, useRef } from "react";
import { 
  calculateAdaptiveTimer, 
  getUrgencyColor, 
  checkNotificationTriggerPoint, 
  formatTimeRemainingForNotification,
  NotificationTriggerPoint 
} from "@/utils/timerUtils";
import { TimerDisplay } from "@/types/tagteam";
import { createTimerWarningNotification } from "@/services/notificationService";
import { checkTeamGoalCompletion } from "@/services/activities/completionCheck";
import { checkAndCloseCycleOnReset, closeTeamActivityCycle } from "@/services/activities/cycleManagement";

export const useTagTeamTimer = (
  frequency: string, 
  resetDay?: string, 
  teamId?: string,
  userId?: string,
  teamName?: string,
  partnerId?: string  // Add partnerId parameter to check activity status
) => {
  const [timer, setTimer] = useState<TimerDisplay>({
    timeString: "00:00:00",
    urgency: "normal"
  });
  
  const [timerColorClass, setTimerColorClass] = useState<string>("text-blue-500");
  const [hasResetOccurred, setHasResetOccurred] = useState<boolean>(false);
  
  // Keep track of last check time
  const lastCheckRef = useRef<Date>(new Date());
  
  // Track which notification points have already been triggered for the current cycle
  const triggeredNotificationsRef = useRef<Set<NotificationTriggerPoint>>(new Set());
  
  // Update timer based on frequency
  useEffect(() => {
    const updateTimer = async () => {
      const now = new Date();
      const timerDisplay = calculateAdaptiveTimer(frequency, resetDay);
      setTimer(timerDisplay);
      setTimerColorClass(getUrgencyColor(timerDisplay.urgency));
      
      // Check if we're at a specific notification trigger point
      if (teamId && userId && teamName && partnerId) {
        const triggerPoint = checkNotificationTriggerPoint(frequency, resetDay);
        
        // Only send notification if we're at a trigger point and haven't sent this one yet
        if (triggerPoint && !triggeredNotificationsRef.current.has(triggerPoint)) {
          console.log(`Timer notification trigger point detected: ${triggerPoint}`);
          
          // IMPORTANT: Check if both users have already completed their activities
          // Only proceed with notification if activity is NOT completed
          const isGoalCompleted = await checkTeamGoalCompletion(teamId, userId, partnerId);
          
          if (!isGoalCompleted) {
            // Format the time remaining for the notification
            const timeRemaining = formatTimeRemainingForNotification(triggerPoint);
            
            console.log(`Sending notification as activity is not yet completed by both users`);
            const notificationSent = await createTimerWarningNotification(
              userId,
              teamName,
              timeRemaining,
              triggerPoint,
              teamId
            );
            
            // If notification was sent successfully, mark this trigger point as done
            if (notificationSent) {
              console.log(`Sent ${triggerPoint} notification for ${teamName}`);
              triggeredNotificationsRef.current.add(triggerPoint);
            }
          } else {
            console.log(`Skipping notification as both users have completed their activities`);
            // Still mark as triggered so we don't check again
            triggeredNotificationsRef.current.add(triggerPoint);
          }
        }
      }
      
      // Check for a reset based on frequency
      const isDaily = frequency.toLowerCase().includes("daily");
      let resetDetected = false;
      
      // For daily frequency, check if we've passed midnight since last check
      if (isDaily) {
        const lastCheck = lastCheckRef.current;
        const lastDate = lastCheck.getDate();
        const currentDate = now.getDate();
        
        // If the date has changed since our last check, a reset occurred
        if (lastDate !== currentDate) {
          console.log("Daily reset detected!");
          resetDetected = true;
        }
      } 
      // For weekly frequency, check if we've reached the reset day
      else if (resetDay) {
        const lastCheck = lastCheckRef.current;
        const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const resetDayIndex = weekdays.indexOf(resetDay.toLowerCase());
        
        if (resetDayIndex !== -1) {
          const lastDayOfWeek = lastCheck.getDay();
          const currentDayOfWeek = now.getDay();
          
          // If we've moved from a day before reset to the reset day or have passed a week
          if ((lastDayOfWeek !== resetDayIndex && currentDayOfWeek === resetDayIndex) ||
              (lastDayOfWeek === currentDayOfWeek && now.getTime() - lastCheck.getTime() >= 7 * 24 * 60 * 60 * 1000)) {
            console.log("Weekly reset detected!");
            resetDetected = true;
          }
        }
      }
      
      // Handle reset detection
      if (resetDetected) {
        setHasResetOccurred(true);
        // Clear triggered notifications on reset
        triggeredNotificationsRef.current.clear();
        
        // Close expired cycles for this team when reset is detected
        // This will close BOTH activity and goal cycles
        if (teamId) {
          console.log(`Attempting to close expired cycles for team ${teamId} due to reset`);
          await checkAndCloseCycleOnReset(teamId, frequency, resetDay);
        }
      }
      
      // Update last check time
      lastCheckRef.current = now;
    };
    
    // Initial update
    updateTimer();
    
    // Set interval for updates - more frequent updates to catch time thresholds accurately
    // For daily timer: check every 30 seconds to catch exact notification triggers
    // For weekly timer: check every minute
    const intervalMs = frequency.toLowerCase().includes("daily") ? 30000 : 60000;
    const interval = setInterval(updateTimer, intervalMs);
    
    return () => clearInterval(interval);
  }, [frequency, resetDay, teamId, userId, teamName, partnerId]);

  // Function to acknowledge the reset and trigger cycle closure
  const acknowledgeReset = async () => {
    setHasResetOccurred(false);
    // Clear triggered notifications when reset is acknowledged
    triggeredNotificationsRef.current.clear();
    
    // Close expired cycles when user acknowledges the reset
    // This ensures both activity and goal cycles are closed properly
    if (teamId) {
      console.log(`User acknowledged reset - closing cycles for team ${teamId}`);
      await checkAndCloseCycleOnReset(teamId, frequency, resetDay);
      
      // Also explicitly close activity cycles to ensure status resets
      await closeTeamActivityCycle(teamId);
    }
  };

  return { timer, timerColorClass, hasResetOccurred, acknowledgeReset };
};
