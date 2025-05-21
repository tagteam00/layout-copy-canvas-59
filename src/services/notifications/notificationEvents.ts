
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType } from './notificationTypes';
import { createNotification } from './notificationCore';

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
  urgency: 'normal' | 'warning' | 'urgent',
  teamId: string
): Promise<Notification | null> => {
  // Only send warnings for warning or urgent timers
  if (urgency === 'normal') return null;
  
  // Check if we've already sent a warning notification recently for this team
  const { data: existingWarnings } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('related_id', teamId)
    .eq('related_to', 'timer_warning' as NotificationType)
    .gt('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()) // Last 12 hours
    .limit(1);
    
  // If we already sent a warning recently, don't send another one
  if (existingWarnings && existingWarnings.length > 0) return null;
  
  // Send a warning notification
  const urgencyText = urgency === 'urgent' ? 'urgently ' : '';
  const message = `Your TagTeam "${teamName}" timer is ${urgencyText}about to reset (${timeRemaining} remaining). Don't forget to log your activity!`;
  
  return createNotification(
    userId,
    message,
    'timer_warning',
    teamId
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
