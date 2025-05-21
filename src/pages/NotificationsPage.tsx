import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Bell, AlertCircle, Clock, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { hasActiveTeamForInterest } from "@/services/teamService";
import { markNotificationsAsRead } from "@/services/goalService";
import { formatDistanceToNow } from "date-fns";

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

const NotificationsPage: React.FC = () => {
  const [requests, setRequests] = useState<TeamRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    
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
                fetchNotifications();
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
          fetchNotifications();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
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
      
      // Fetch regular notifications
      await fetchUserNotifications(user.id);

      // Set all notifications as read when visiting the page
      await markNotificationsAsRead(user.id);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNotifications = async (userId: string) => {
    try {
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      toast.error("Failed to load notifications");
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
            message: `${requestToAccept.receiver_id} has accepted your TagTeam request for ${teamName}`,
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
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      // Remove the notification from the UI
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success("Notification dismissed");
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error("Failed to dismiss notification");
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'activity_status_update':
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case 'timer_warning':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'team_request_accepted':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get notification style based on type
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'activity_status_update':
        return "border-blue-100";
      case 'timer_warning':
        return "border-amber-100";
      case 'team_request_accepted':
        return "border-green-100";
      default:
        return "border-gray-100";
    }
  };

  // Format notification time
  const formatNotificationTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
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
        ) : (
          <div className="space-y-4">
            {/* Team Requests Section */}
            {requests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Tag Team Requests</h2>
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
                          onClick={() => handleAccept(request.id, request.name, request.category)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Other Notifications Section */}
            {notifications.length > 0 && (
              <div>
                {requests.length > 0 && <h2 className="text-lg font-medium mb-3">Activity Updates</h2>}
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`border-l-4 ${getNotificationStyle(notification.related_to)}`}
                    >
                      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                        <div className="flex items-center">
                          {getNotificationIcon(notification.related_to)}
                          <span className="ml-2 text-sm text-gray-500">
                            {formatNotificationTime(notification.created_at)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDismissNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm">{notification.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
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
