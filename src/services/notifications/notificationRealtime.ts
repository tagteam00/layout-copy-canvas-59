
import { supabase } from '@/integrations/supabase/client';
import { Notification } from './notificationTypes';
import { toast } from 'sonner';

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
