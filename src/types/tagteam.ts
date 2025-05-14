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
  ended_at?: string | null;  // Added this property
  ended_by?: string | null;  // Added this property
}

export interface TransformedTeam {
  id: string;
  name: string;
  firstUser: {
    id: string;
    name: string;
    status: "pending" | "completed";
    goal: string;
  };
  secondUser: {
    id: string;
    name: string;
    status: "pending" | "completed";
    goal: string;
  };
  interest: string;
  frequency: string;
  resetDay?: string;
  resetTime?: string;
  ended_at?: string | null;
  ended_by?: string | null;
}
