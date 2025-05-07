import React from "react";
import { Bell } from "lucide-react";
export const EmptyNotifications: React.FC = () => {
  return <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <Bell className="h-10 w-10 text-gray-400 bg-[827AFF] bg-transparent" />
      </div>
      <h3 className="text-lg font-medium mb-2">No notifications</h3>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        You're all caught up! We'll notify you when there's activity or requests from other users.
      </p>
    </div>;
};