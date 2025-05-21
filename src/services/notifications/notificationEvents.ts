
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType } from './notificationTypes';
import { createNotification } from './notificationCore';
import { NotificationTriggerPoint } from '@/utils/timerUtils';

/**
 * Create an activity status notification
 */
export const createActivityStatusNotification = async (
  userId: string,
  partnerName: string,
  status: 'completed' | 'pending',
  teamName: string,
  teamId: string
): Promise<Notification | null> => {
  const statusText = status === 'completed' ? 'completed' : 'pending';
  const message = `${partnerName} has marked your activity as ${statusText} in "${teamName}"`;
  
  return createNotification(
    userId,
    message,
    'activity_status_update',
    teamId
  );
};

/**
 * Create a timer warning notification
 */
export const createTimerWarningNotification = async (
  userId: string,
  teamName: string,
  timeRemaining: string,
  triggerPoint: NotificationTriggerPoint,
  teamId: string
): Promise<Notification | null> => {
  // Only send notifications for valid trigger points
  if (!triggerPoint) return null;
  
  // Check if we've already sent this specific trigger point notification recently
  const { data: existingWarnings, error } = await supabase
    .from('notifications')
    .select('id, metadata')
    .eq('user_id', userId)
    .eq('related_id', teamId)
    .eq('related_to', 'timer_warning' as NotificationType)
    .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .order('created_at', { ascending: false })
    .limit(5); // Get the most recent ones
  
  if (error) {
    console.error("Error checking for existing timer warnings:", error);
    return null;
  }
    
  // Check if we've already sent this specific trigger point
  if (existingWarnings && existingWarnings.length > 0) {
    for (const warning of existingWarnings) {
      try {
        // Parse the metadata if it exists
        if (warning.metadata && typeof warning.metadata === 'object') {
          const metadata = warning.metadata as any;
          if (metadata.triggerPoint === triggerPoint) {
            console.log(`Already sent ${triggerPoint} warning recently`);
            return null;
          }
        }
      } catch (error) {
        console.error("Error parsing notification metadata:", error);
      }
    }
  }
  
  // Send a warning notification with the specific time point
  const message = `Your TagTeam "${teamName}" has ${timeRemaining} remaining. Don't forget to log your activity!`;
  
  // Include the trigger point in metadata so we can avoid duplicates
  const metadata = { triggerPoint };
  
  return createNotification(
    userId,
    message,
    'timer_warning',
    teamId,
    metadata
  );
};

/**
 * Create a goal completion notification for both users
 */
export const createGoalCompletedNotification = async (
  firstUserId: string,
  secondUserId: string,
  teamName: string,
  teamId: string
): Promise<[Notification | null, Notification | null]> => {
  try {
    // Create notification message
    const message = `Congratulations! You've successfully completed your goal with your partner in "${teamName}"! 🎉`;
    
    // Check if we've already sent a goal completion notification for this team recently
    const { data: existingNotifications, error } = await supabase
      .from('notifications')
      .select('id')
      .eq('related_id', teamId)
      .eq('related_to', 'goal_completed' as NotificationType)
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .limit(1);
      
    if (error) {
      console.error("Error checking for existing goal completion notifications:", error);
      return [null, null];
    }
      
    // If we already sent a notification recently, don't send another one
    if (existingNotifications && existingNotifications.length > 0) {
      console.log('Goal completion notification already sent recently for this team');
      return [null, null];
    }
    
    // Send notification to first user
    const firstUserNotification = await createNotification(
      firstUserId,
      message,
      'goal_completed',
      teamId
    );
    
    // Send notification to second user
    const secondUserNotification = await createNotification(
      secondUserId,
      message,
      'goal_completed',
      teamId
    );
    
    return [firstUserNotification, secondUserNotification];
  } catch (error) {
    console.error('Error creating goal completion notifications:', error);
    return [null, null];
  }
};

/**
 * Check if there's an unread goal completion notification for a user and team
 */
export const checkUnreadGoalCompletionNotification = async (
  userId: string,
  teamId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('related_id', teamId)
      .eq('related_to', 'goal_completed' as NotificationType)
      .eq('read', false)
      .limit(1);
      
    if (error) throw error;
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking unread goal notifications:', error);
    return false;
  }
};
