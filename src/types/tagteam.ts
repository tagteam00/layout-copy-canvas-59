
export type Frequency = {
  type: 'daily' | 'weekly';
  day?: string; // For weekly frequency
};

export type CreateTeamStep = 'name' | 'interest' | 'frequency' | 'partner';
