
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Notification {
  id: string;
  user_id: string;
  message: string;
  related_to: string;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationCardProps {
  notification: Notification;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  return (
    <Card className="border-[rgba(130,122,255,0.41)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(notification.created_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};
