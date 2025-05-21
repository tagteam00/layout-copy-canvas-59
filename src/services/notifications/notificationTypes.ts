
export type NotificationType = 
  | 'team_request' 
  | 'team_request_accepted' 
  | 'team_request_rejected'
  | 'activity_status_update'
  | 'timer_warning'
  | 'goal_completed';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  related_to: NotificationType;
  related_id?: string;
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}
