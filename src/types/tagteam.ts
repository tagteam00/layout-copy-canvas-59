
export type Frequency = {
  type: 'daily' | 'weekly';
  day?: string; // For weekly frequency
};

export type CreateTeamStep = 'interest' | 'partner' | 'frequency' | 'name';

export type TimerUrgency = 'normal' | 'warning' | 'urgent';

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
  id: string;
  team_id: string;
  user_id: string;
  status: "completed" | "pending";
  cycle_start: string;
  cycle_end?: string;
  updated_at: string;
}
