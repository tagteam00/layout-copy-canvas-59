
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  related_id: string;
  read: boolean;
  created_at: string;
}

const NotificationsPage: React.FC = () => {
  const [requests, setRequests] = useState<TeamRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

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

      // Set all notifications as read when visiting the page
      markNotificationsAsRead(user.id);
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

  const markNotificationsAsRead = async (userId: string) => {
    // Future implementation if we add a notifications table
    // For now, we're just using team_requests table for notifications
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
        await supabase
          .from('notifications')
          .insert({
            user_id: requestToAccept.sender_id,
            message: `${requestToAccept.sender_name} has accepted your TagTeam request for ${teamName}`,
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

  const NotificationSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2].map((i) => (
        <Card key={i} className="border-[rgba(130,122,255,0.41)]">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const EmptyNotifications = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <Bell className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No notifications</h3>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        You're all caught up! We'll notify you when there's activity or requests from other users.
      </p>
    </div>
  );

  return (
    <main className="bg-white max-w-[480px] w-full mx-auto pb-16">
      <AppHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>

        {loading ? (
          <NotificationSkeleton />
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-[rgba(130,122,255,0.41)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{request.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-1">
                    <span className="font-medium">{request.sender_name}</span> invited you to join their TagTeam
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-[rgba(130,122,255,1)]">{request.category}</Badge>
                    <Badge variant="outline">{request.frequency}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => handleReject(request.id, request.name)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    className="bg-[#827AFF] hover:bg-[#827AFF]/90"
                    onClick={() => handleAccept(request.id, request.name)}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyNotifications />
        )}
      </div>
      <BottomNavigation />
    </main>
  );
};

export default NotificationsPage;
