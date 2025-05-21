
import { NotificationType } from "./notificationTypes";

/**
 * Get notification icon and style based on type
 */
export const getNotificationStyles = (type: string) => {
  switch (type) {
    case 'activity_status_update':
      return {
        iconColor: "text-blue-500",
        borderColor: "border-blue-100"
      };
    case 'timer_warning':
      return {
        iconColor: "text-amber-500",
        borderColor: "border-amber-100"
      };
    case 'team_request_accepted':
      return {
        iconColor: "text-green-500",
        borderColor: "border-green-100"
      };
    case 'team_request':
      return {
        iconColor: "text-purple-500",
        borderColor: "border-purple-100"
      };
    case 'goal_completed':
      return {
        iconColor: "text-yellow-500",
        borderColor: "border-yellow-100"
      };
    default:
      return {
        iconColor: "text-gray-500",
        borderColor: "border-gray-100"
      };
  }
};
