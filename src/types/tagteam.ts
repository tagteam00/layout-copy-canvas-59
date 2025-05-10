export type Frequency = {
  type: 'daily' | 'weekly';
  day?: string; // For weekly frequency
};

export type CreateTeamStep = 'interest' | 'partner' | 'frequency' | 'name';

export type TimerUrgency = "normal" | "warning" | "urgent";

export interface TimerDisplay {
  timeString: string;
  urgency: TimerUrgency;
}

export interface TagTeam {
  id: string;
  name: string;
  firstUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
    id: string;
  };
  secondUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
    id: string;
  };
  interest: string;
  frequency: string;
  resetDay?: string;
  resetTime?: string;
}

export interface TeamActivity {
  id?: string;
  team_id: string;
  user_id: string;
  logged_by_user_id: string;
  status: 'completed' | 'pending';
  cycle_start: string;
  cycle_end?: string;
  created_at?: string;
}

export interface GoalSectionProps {
  activeGoal: string;
  setActiveGoal: React.Dispatch<React.SetStateAction<string>>;
  currentUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
  };
  partnerUser: {
    name: string;
    status: "completed" | "pending";
    goal?: string;
  };
  onSetGoal: () => void;
  showCalendar: boolean; 
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CalendarSectionProps {
  daysOfWeek: string[];
  today: number;
  onClose: () => void;
}
