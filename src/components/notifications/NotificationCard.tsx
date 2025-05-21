
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Bell, UserCheck, Clock, Check } from "lucide-react";
import { Notification, getNotificationStyles } from "@/services/notificationService";
import { formatDistanceToNow } from "date-fns";

interface NotificationCardProps {
  notification: Notification;
  onDismiss: (notificationId: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onDismiss 
}) => {
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'activity_status_update':
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case 'timer_warning':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'team_request_accepted':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'goal_completed':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format notification time
  const formatNotificationTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const styles = getNotificationStyles(notification.related_to);

  return (
    <Card className={`border-l-4 ${styles.borderColor}`}>
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
          onClick={() => onDismiss(notification.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <p className="text-sm">{notification.message}</p>
      </CardContent>
    </Card>
  );
};
