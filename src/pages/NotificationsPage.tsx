import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  fetchNotifications, 
  markNotificationsAsRead, 
  deleteNotification,
  Notification,
} from "@/services/notificationService";
import { hasActiveTeamForInterest } from "@/services/teamService";
import { TeamRequestsList } from "@/components/notifications/TeamRequestsList";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { NotificationSkeleton } from "@/components/notifications/NotificationSkeleton";
import { EmptyNotifications } from "@/components/notifications/EmptyNotifications";

interface TeamRequest {
  id: string;
  name: string;
  category: string;
  frequency: string;
  reset_day?: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_name?: string;
}

const NotificationsPage: React.FC = () => {
  const [requests, setRequests] = useState<TeamRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllNotifications();
    
    // Set up real-time listener for new notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          // Check if the notification is for the current user
          const notification = payload.new as Notification;
          if (notification) {
            supabase.auth.getUser().then(({ data }) => {
              if (data?.user && notification.user_id === data.user.id) {
                fetchAllNotifications();
              }
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_requests'
        },
        () => {
          fetchAllNotifications();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to view notifications");
        setLoading(false);
        return;
      }

      // Fetch team requests
      await fetchTeamRequests(user.id);
      
      // Fetch regular notifications
      const notificationsData = await fetchNotifications(user.id);
      setNotifications(notificationsData);

      // Set all notifications as read when visiting the page
      await markNotificationsAsRead(user.id);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamRequests = async (userId: string) => {
    // Get all requests where the current user is the receiver and status is pending
    const { data: requestsData, error } = await supabase
      .from('team_requests')
      .select('*')
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (error) throw error;

    // Get sender names for each request
    const requestsWithSenderNames = await Promise.all(
      (requestsData || []).map(async (request) => {
        // Get the sender name from public_profiles table first, fallback to profiles
        let senderName = 'Unknown User';
        
        // Try public_profiles first (this syncs automatically)
        const { data: publicProfile, error: publicError } = await supabase
          .from('public_profiles')
          .select('full_name')
          .eq('id', request.sender_id)
          .maybeSingle();

        if (!publicError && publicProfile?.full_name) {
          senderName = publicProfile.full_name;
        } else {
          // Fallback to profiles table
          const { data: senderProfile, error: senderError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', request.sender_id)
            .maybeSingle();

          if (!senderError && senderProfile?.full_name) {
            senderName = senderProfile.full_name;
          } else {
            console.error('Error fetching sender name from both tables:', { publicError, senderError });
          }
        }

        return {
          ...request,
          sender_name: senderName,
        };
      })
    );

    setRequests(requestsWithSenderNames);
  };

  const handleAccept = async (requestId: string, teamName: string, category: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to accept a request");
        setLoading(false);
        return;
      }

      // Check if user already has an active team for this interest
      const hasActiveTeam = await hasActiveTeamForInterest(user.id, category);
      
      if (hasActiveTeam) {
        toast.error(`You already have an active TagTeam for ${category}. Please end that team before accepting this request.`);
        setLoading(false);
        return;
      }

      // Update the request status to accepted
      const { error: updateError } = await supabase
        .from('team_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create a new team in the teams table
      const requestToAccept = requests.find(r => r.id === requestId);

      if (requestToAccept) {
        const { error: teamError, data: newTeam } = await supabase
          .from('teams')
          .insert({
            name: requestToAccept.name,
            category: requestToAccept.category,
            frequency: requestToAccept.frequency,
            reset_day: requestToAccept.reset_day,
            members: [requestToAccept.sender_id, requestToAccept.receiver_id],
          })
          .select()
          .single();

        if (teamError) throw teamError;
        
        // Create a notification for the sender
        await supabase
          .from('notifications')
          .insert({
            user_id: requestToAccept.sender_id,
            message: `${user.user_metadata?.full_name || 'Your partner'} has accepted your TagTeam request for ${teamName}`,
            related_to: 'team_request_accepted',
            related_id: requestId,
            read: false
          })
          .select();
      }

      // Remove the accepted request from the UI
      setRequests(requests.filter(r => r.id !== requestId));
      toast.success(`You've accepted to join ${teamName}!`);
    } catch (error) {
      console.error('Error accepting team request:', error);
      toast.error("Failed to accept the request");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId: string, teamName: string) => {
    try {
      // Update the request status to rejected
      const { error } = await supabase
        .from('team_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      // Remove the rejected request from the UI
      setRequests(requests.filter(r => r.id !== requestId));
      toast.success(`You've rejected the request to join ${teamName}`);
    } catch (error) {
      console.error('Error rejecting team request:', error);
      toast.error("Failed to reject the request");
    }
  };

  const handleDismissNotification = async (notificationId: string) => {
    try {
      // Delete the notification
      const success = await deleteNotification(notificationId);

      if (!success) throw new Error("Failed to delete notification");

      // Remove the notification from the UI
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success("Notification dismissed");
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error("Failed to dismiss notification");
    }
  };

  return (
    <main className="bg-white max-w-[480px] w-full mx-auto pb-16">
      <AppHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>

        {loading ? (
          <NotificationSkeleton />
        ) : (
          <div className="space-y-4">
            {/* Team Requests Section */}
            <TeamRequestsList 
              requests={requests} 
              onAccept={handleAccept} 
              onReject={handleReject} 
            />
            
            {/* Other Notifications Section */}
            <NotificationsList 
              notifications={notifications} 
              onDismiss={handleDismissNotification} 
              showHeading={requests.length > 0} 
            />
            
            {/* Empty state when no notifications */}
            {notifications.length === 0 && requests.length === 0 && (
              <EmptyNotifications />
            )}
          </div>
        )}
      </div>
      <BottomNavigation />
    </main>
  );
};

export default NotificationsPage;
