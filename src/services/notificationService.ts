
// This file re-exports all notification-related functionality from smaller modules
// It serves as the public API for notifications

// Re-export types
export type { Notification, NotificationType } from './notifications/notificationTypes';

// Re-export core CRUD functions
export {
  createNotification,
  fetchNotifications,
  fetchUnreadNotificationsCount,
  markNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from './notifications/notificationCore';

// Re-export specialized notification event functions
export {
  createActivityStatusNotification,
  createTimerWarningNotification,
  createGoalCompletedNotification,
  checkUnreadGoalCompletionNotification,
} from './notifications/notificationEvents';

// Re-export real-time functions
export {
  subscribeToNotifications,
} from './notifications/notificationRealtime';

// Re-export styling functions
export {
  getNotificationStyles,
} from './notifications/notificationStyles';
