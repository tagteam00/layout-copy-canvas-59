
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType } from './notificationTypes';

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
