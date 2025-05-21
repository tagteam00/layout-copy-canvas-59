
import { supabase } from '@/integrations/supabase/client';

// Define team type directly to avoid circular dependencies
export interface Team {
  id: string;
  name: string;
  members: string[];
  category: string;
  frequency: string;
  created_at: string;
  ended_at?: string | null;
  ended_by?: string | null;
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
    
    console.log('Updating team with ID:', teamId);
    console.log('User ending team:', userId);
    
    // Explicitly prepare the update data
    const updateData = {
      ended_at: new Date().toISOString(),
      ended_by: userId
    };
    
    console.log('Update data:', updateData);
    
    // Now update with all the end-related fields
    const { data, error } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', teamId)
      .select();
      
    if (error) {
      console.error('Error updating team:', error);
      throw error;
    }
    
    console.log('Update response:', data);
    
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

// New function to check if user already has an active team for a specific interest
export const hasActiveTeamForInterest = async (userId: string, interest: string): Promise<boolean> => {
  try {
    // Get all active teams (where ended_at is null) for the user
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .contains('members', [userId])
      .is('ended_at', null);
      
    if (error) throw error;
    
    // Check if any of the active teams have the specified interest
    const hasTeam = (data || []).some((team: Team) => team.category === interest);
    
    return hasTeam;
  } catch (error) {
    console.error('Error checking active teams for interest:', error);
    throw error;
  }
};

// New function to check if there's a pending request for the interest
export const hasPendingRequestForInterest = async (userId: string, interest: string): Promise<boolean> => {
  try {
    // Check for pending sent requests
    const { data: sentRequests, error: sentError } = await supabase
      .from('team_requests')
      .select('*')
      .eq('sender_id', userId)
      .eq('category', interest)
      .eq('status', 'pending');
      
    if (sentError) throw sentError;

    // Check for pending received requests
    const { data: receivedRequests, error: receivedError } = await supabase
      .from('team_requests')
      .select('*')
      .eq('receiver_id', userId)
      .eq('category', interest)
      .eq('status', 'pending');
      
    if (receivedError) throw receivedError;
    
    return (sentRequests?.length || 0) > 0 || (receivedRequests?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking pending requests for interest:', error);
    throw error;
  }
};
