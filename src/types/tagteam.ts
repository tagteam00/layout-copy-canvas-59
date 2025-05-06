
export type Frequency = {
  type: 'daily' | 'weekly';
  day?: string; // For weekly frequency
};

export type CreateTeamStep = 'interest' | 'partner' | 'frequency' | 'name';

export type TimerUrgency = 'normal' | 'warning' | 'urgent';

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
