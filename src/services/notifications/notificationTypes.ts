
export type NotificationType = 
  | 'activity_status_update' 
  | 'timer_warning' 
  | 'team_request_accepted' 
  | 'team_request' 
  | 'team_update' 
  | 'goal_completed';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  related_to: NotificationType;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

export interface NotificationStyle {
  iconColor: string;
  borderColor: string;
}
