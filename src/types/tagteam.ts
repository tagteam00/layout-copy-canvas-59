
export type Frequency = {
  type: 'daily' | 'weekly';
  day?: string; // For weekly frequency
};

export type CreateTeamStep = 'interest' | 'partner' | 'frequency' | 'name';
