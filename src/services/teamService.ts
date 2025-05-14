
import { supabase } from '@/integrations/supabase/client';

// Define team type directly to avoid circular dependencies
export interface Team {
  id: string;
  name: string;
  members: string[];
  category: string;
  frequency: string;
  created_at: string;
  status?: 'active' | 'ended';
  ended_at?: string | null;
  ended_by?: string | null;
  end_reason?: string | null;
}

export const fetchTeams = async (userId: string): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .contains('members', [userId]);
      
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
}): Promise<Team> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select();
      
    if (error) throw error;
    return data?.[0] as Team;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

export const leaveTeam = async (teamId: string, userId: string): Promise<Team> => {
  try {
    // First, get the current team data to ensure we have access to all fields
    const { data: teamData, error: getError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
      
    if (getError) throw getError;
    
    // Now update with all the end-related fields
    const { data, error } = await supabase
      .from('teams')
      .update({
        ended_at: new Date().toISOString(),
        ended_by: userId,
        end_reason: 'user_left'
      })
      .eq('id', teamId)
      .select();
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Send notification to other team members
      await notifyTeamMembers(data[0] as Team, userId);
    }
    
    return data?.[0] as Team;
  } catch (error) {
    console.error('Error leaving team:', error);
    throw error;
  }
};

const notifyTeamMembers = async (team: Team, leavingUserId: string): Promise<void> => {
  try {
    // Find the other members who need to be notified
    const otherMembers = team.members.filter(memberId => memberId !== leavingUserId);
    
    // Get the name of the user who left
    const { data: userData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', leavingUserId)
      .single();
    
    const userName = userData?.full_name || 'Your partner';
    
    // Create notifications for each member
    const notifications = otherMembers.map(memberId => ({
      user_id: memberId,
      related_id: team.id,
      message: `${userName} has ended your Tag Team "${team.name}"`,
      related_to: 'team_ended'
    }));
    
    if (notifications.length > 0) {
      await supabase.from('notifications').insert(notifications);
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
    // Don't throw here - we don't want to fail the leave operation
    // if notifications fail
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
