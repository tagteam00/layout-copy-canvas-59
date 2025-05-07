
import React from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { NotificationSkeleton } from "@/components/notifications/NotificationSkeleton";
import { EmptyNotifications } from "@/components/notifications/EmptyNotifications";
import { TeamRequestCard } from "@/components/notifications/TeamRequestCard";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationsPage: React.FC = () => {
  const { requests, notifications, loading, handleAccept, handleReject } = useNotifications();
  
  const hasNotifications = requests.length > 0 || notifications.length > 0;

  return (
    <main className="bg-white max-w-[480px] w-full mx-auto pb-16">
      <AppHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>

        {loading ? (
          <NotificationSkeleton />
        ) : hasNotifications ? (
          <div className="space-y-4">
            {/* Team Requests */}
            {requests.map((request) => (
              <TeamRequestCard 
                key={request.id} 
                request={request} 
                onAccept={handleAccept} 
                onReject={handleReject} 
              />
            ))}

            {/* System Notifications */}
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
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
