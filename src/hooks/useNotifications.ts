
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { markNotificationsAsRead, createNotification } from "@/services/goalService";

interface TeamRequest {
  id: string;
  name: string;
  category: string;
  frequency: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_name?: string;
}

interface Notification {
  id: string;
  user_id: string;
  message: string;
  related_to: string;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [requests, setRequests] = useState<TeamRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
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
      
      // Fetch notifications from notifications table
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (notificationsError) throw notificationsError;
      
      setNotifications(notificationsData || []);

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
        // Get the sender name from profiles table
        const { data: senderProfile, error: senderError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', request.sender_id)
          .maybeSingle();

        if (senderError) {
          console.error('Error fetching sender name:', senderError);
        }

        return {
          ...request,
          sender_name: senderProfile?.full_name || 'Unknown User',
        };
      })
    );

    setRequests(requestsWithSenderNames);
  };

  const handleAccept = async (requestId: string, teamName: string) => {
    try {
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
            members: [requestToAccept.sender_id, requestToAccept.receiver_id],
          })
          .select()
          .single();

        if (teamError) throw teamError;
        
        // Create a notification for the sender
        await createNotification(
          requestToAccept.sender_id,
          `Your TagTeam request for ${teamName} has been accepted!`,
          'team_request_accepted',
          requestId
        );
      }

      // Remove the accepted request from the UI
      setRequests(requests.filter(r => r.id !== requestId));
      toast.success(`You've accepted to join ${teamName}!`);
    } catch (error) {
      console.error('Error accepting team request:', error);
      toast.error("Failed to accept the request");
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

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  return {
    requests,
    notifications,
    loading,
    handleAccept,
    handleReject,
  };
};
