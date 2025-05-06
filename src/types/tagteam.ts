
export type Frequency = {
  type: 'daily' | 'weekly';
  day?: string | number; // For weekly frequency
};

export type CreateTeamStep = 'interest' | 'partner' | 'frequency' | 'name';

export type TimeDisplay = {
  timeString: string;
  urgency: 'normal' | 'warning' | 'urgent';
};
