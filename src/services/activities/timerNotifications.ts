
import { NotificationTriggerPoint } from "@/utils/timerUtils";
import { createTimerWarningNotification } from "@/services/notificationService";
import { checkTeamGoalCompletion } from "./completionCheck";

// Function to check if a user needs a timer reset warning notification
export const checkAndSendTimerWarning = async (
  teamId: string,
  userId: string,
  partnerId: string,
  teamName: string,
  timeRemaining: string,
  urgency: NotificationTriggerPoint
): Promise<boolean> => {
  try {
    // First, check if the activity is already completed by both users
    const isActivityCompleted = await checkTeamGoalCompletion(teamId, userId, partnerId);
    
    // If activity is completed, don't send a warning
    if (isActivityCompleted) {
      console.log(`Skipping timer warning for ${teamId} as activity is already completed`);
      return false;
    }
    
    const notification = await createTimerWarningNotification(
      userId,
      teamName,
      timeRemaining,
      urgency,
      teamId
    );
    
    return !!notification;
  } catch (error) {
    console.error('Error checking/sending timer warning:', error);
    return false;
  }
};
