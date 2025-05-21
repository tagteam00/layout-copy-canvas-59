
import React from "react";
import { NotificationCard } from "./NotificationCard";
import { Notification } from "@/services/notificationService";

interface NotificationsListProps {
  notifications: Notification[];
  onDismiss: (notificationId: string) => void;
  showHeading?: boolean;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onDismiss,
  showHeading = false,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div>
      {showHeading && <h2 className="text-lg font-medium mb-3">Activity Updates</h2>}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
};
