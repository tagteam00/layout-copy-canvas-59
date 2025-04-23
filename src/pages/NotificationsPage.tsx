
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const NotificationsPage: React.FC = () => {
  const [requests, setRequests] = useState<TeamRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");

  // Navigation items
  const navItems = [
    {
      name: "Home",
      icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/c761f5256fcea0afdf72f5aa0ab3d05e40a3545b?placeholderIfAbsent=true",
      path: "/",
      isActive: activeTab === "home",
    },
    {
      name: "Tagteam",
      icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/99b9d22862884f6e83475b74fa086fd10fb5e57f?placeholderIfAbsent=true",
      path: "/tagteam",
      isActive: activeTab === "tagteam",
    },
    {
      name: "Notifications",
      icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/6015a6ceb8f49982ed2ff6177f7ee6374f72c48d?placeholderIfAbsent=true",
      path: "/notifications",
      isActive: activeTab === "notifications",
    },
    {
      name: "Profile",
      icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/6015a6ceb8f49982ed2ff6177f7ee6374f72c48d?placeholderIfAbsent=true",
      path: "/profile",
      isActive: activeTab === "profile",
    },
  ];

  useEffect(() => {
    fetchTeamRequests();
    // eslint-disable-next-line
  }, []);

  const fetchTeamRequests = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to view notifications");
        setLoading(false);
        return;
      }

      // Get all requests where the current user is the receiver and status is pending
      const { data: requestsData, error } = await supabase
        .from('team_requests')
        .select('*')
        .eq('receiver_id', user.id)
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
    } catch (error) {
      console.error('Error fetching team requests:', error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
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
        const { error: teamError } = await supabase
          .from('teams')
          .insert({
            name: requestToAccept.name,
            category: requestToAccept.category,
            frequency: requestToAccept.frequency,
            members: [requestToAccept.sender_id, requestToAccept.receiver_id],
          });

        if (teamError) throw teamError;
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

  return (
    <main className="bg-white max-w-[480px] w-full mx-auto pb-16">
      <AppHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
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
          <div className="text-center py-8">
            <p className="text-gray-500">No pending requests</p>
          </div>
        )}
      </div>
      <BottomNavigation items={navItems} />
    </main>
  );
};

export default NotificationsPage;
