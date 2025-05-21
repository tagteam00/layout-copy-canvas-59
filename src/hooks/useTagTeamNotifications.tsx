
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkUnreadGoalCompletionNotification, markNotificationAsRead } from "@/services/notificationService";

export const useTagTeamNotifications = (
  isOpen: boolean,
  teamId: string,
  userId: string
) => {
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const [checkedForUnreadNotifications, setCheckedForUnreadNotifications] = useState<boolean>(false);

  // Subscribe to real-time updates for notifications
  useEffect(() => {
    if (!isOpen || !userId || !teamId) return;

    // Subscribe to changes in notifications table for this team and user
    const channel = supabase.channel(`notifications-${teamId}-${userId}`).on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId} AND related_id=eq.${teamId} AND related_to=eq.goal_completed`
    }, payload => {
      console.log('Goal completion notification:', payload);
      // Show congratulations dialog if a new goal completion notification is received
      if (!showCongrats) {
        setShowCongrats(true);
        markNotificationAsRead(payload.new.id);
      }
    }).subscribe();
    
    return () => {
      // Clean up subscription on unmount or when sheet closes
      supabase.removeChannel(channel);
    };
  }, [isOpen, userId, teamId, showCongrats]);

  // Check for unread goal completion notifications when the sheet opens
  useEffect(() => {
    const checkGoalNotifications = async () => {
      if (!isOpen || !userId || !teamId || checkedForUnreadNotifications) return;
      
      try {
        // Check if there are unread goal completion notifications for this team
        const hasUnreadNotifications = await checkUnreadGoalCompletionNotification(userId, teamId);
        
        if (hasUnreadNotifications) {
          console.log("Found unread goal completion notification, showing congratulations");
          setShowCongrats(true);
          
          // Fetch notifications to mark them as read
          const { data: notifications } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('related_id', teamId)
            .eq('related_to', 'goal_completed')
            .eq('read', false);
            
          // Mark notifications as read
          if (notifications && notifications.length > 0) {
            for (const notification of notifications) {
              await markNotificationAsRead(notification.id);
            }
          }
        }
        
        setCheckedForUnreadNotifications(true);
      } catch (error) {
        console.error("Error checking goal notifications:", error);
      }
    };
    
    checkGoalNotifications();
  }, [isOpen, userId, teamId, checkedForUnreadNotifications]);
  
  // Reset the checked flag when the sheet is closed
  useEffect(() => {
    if (!isOpen) {
      setCheckedForUnreadNotifications(false);
    }
  }, [isOpen]);

  return {
    showCongrats,
    setShowCongrats
  };
};
