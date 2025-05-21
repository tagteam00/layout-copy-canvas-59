import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  related_to: string;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

export type NotificationType = 'activity_status_update' | 'timer_warning' | 'team_request_accepted' | 'team_request' | 'team_update' | 'goal_completed';

/**
 * Create a new notification for a user
 */
export const createNotification = async (
  userId: string, 
  message: string, 
  relatedTo: NotificationType, 
  relatedId?: string
): Promise<Notification | null> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        message,
        related_to: relatedTo,
        related_id: relatedId,
        read: false
      }])
      .select();
      
    if (error) throw error;
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Fetch notifications for a user
 */
export const fetchNotifications = async (
  userId: string,
  limit: number = 20,
  markAsRead: boolean = false
): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    // If markAsRead is true, mark all fetched notifications as read
    if (markAsRead && data && data.length > 0) {
      await markNotificationsAsRead(userId);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Fetch unread notifications count for a user
 */
export const fetchUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    // Get pending team requests count
    const { count: requestsCount, error: requestsError } = await supabase
      .from('team_requests')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (requestsError) throw requestsError;
    
    // Get unread notifications count
    const { count: notificationsCount, error: notificationsError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (notificationsError) throw notificationsError;
    
    // Combine both counts
    return (requestsCount || 0) + (notificationsCount || 0);
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    return 0;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return false;
  }
};

/**
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Delete a specific notification
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

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
    .eq('related_to', 'timer_warning')
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

/**
 * Set up a real-time subscription for notifications
 */
export const subscribeToNotifications = (
  userId: string, 
  onNewNotification: (notification: Notification) => void
) => {
  const channel = supabase
    .channel('notification-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        const newNotification = payload.new as Notification;
        onNewNotification(newNotification);
        
        // You can also show a toast for immediate feedback
        toast(newNotification.message, {
          description: "New notification received"
        });
      }
    )
    .subscribe();
    
  // Return a cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Get notification icon and style based on type
 */
export const getNotificationStyles = (type: string) => {
  switch (type) {
    case 'activity_status_update':
      return {
        iconColor: "text-blue-500",
        borderColor: "border-blue-100"
      };
    case 'timer_warning':
      return {
        iconColor: "text-amber-500",
        borderColor: "border-amber-100"
      };
    case 'team_request_accepted':
      return {
        iconColor: "text-green-500",
        borderColor: "border-green-100"
      };
    case 'team_request':
      return {
        iconColor: "text-purple-500",
        borderColor: "border-purple-100"
      };
    case 'goal_completed':
      return {
        iconColor: "text-yellow-500",
        borderColor: "border-yellow-100"
      };
    default:
      return {
        iconColor: "text-gray-500",
        borderColor: "border-gray-100"
      };
  }
};
