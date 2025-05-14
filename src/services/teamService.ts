
import { supabase } from '@/integrations/supabase/client';

// Define team interface explicitly to avoid circular type references
type Team = {
  id: string;
  name: string;
  members: string[];
  category: string;
  frequency: string;
  status?: string;
};

export const fetchTeams = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .contains('members', [userId])
      .eq('status', 'active');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const createTeam = async (teamData: {
  name: string;
  members: string[];
  category: string;
  frequency: string;
  status?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select();
      
    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

export const leaveTeam = async (teamId: string) => {
  try {
    // We'll update the team status to 'ended' rather than deleting it
    // This preserves the team history
    const { error } = await supabase
      .from('teams')
      .update({ status: 'ended' } as any)
      .eq('id', teamId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error leaving team:', error);
    throw error;
  }
};

export const getUserTeamActivity = async (teamId: string, userId: string) => {
  // This would be implemented once we have an activities table
  // For now, returning mock data
  return {
    completed: Math.random() > 0.5,
    lastCompletedAt: new Date().toISOString(),
  };
};
