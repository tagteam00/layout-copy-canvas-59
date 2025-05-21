
import { supabase } from '@/integrations/supabase/client';

export const fetchTeamGoal = async (teamId: string, userId: string) => {
  try {
    // Updated to only fetch goals that are active for the current cycle
    // (where cycle_end is null or in the future)
    const { data, error } = await supabase
      .from('team_goals')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .is('cycle_end', null)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching team goal:', error);
    throw error;
  }
};

export const createTeamGoal = async (teamId: string, userId: string, goal: string) => {
  try {
    // Set the cycle_start to current time when creating a new goal
    const { data, error } = await supabase
      .from('team_goals')
      .insert([{
        team_id: teamId,
        user_id: userId,
        goal,
        cycle_start: new Date().toISOString()
      }])
      .select();
      
    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Error creating team goal:', error);
    throw error;
  }
};

export const updateTeamGoal = async (goalId: string, goal: string) => {
  try {
    const { data, error } = await supabase
      .from('team_goals')
      .update({ goal })
      .eq('id', goalId)
      .select();
      
    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Error updating team goal:', error);
    throw error;
  }
};

// New function to mark goals as completed for a cycle
export const closeCurrentGoalCycle = async (goalId: string) => {
  try {
    const { data, error } = await supabase
      .from('team_goals')
      .update({ cycle_end: new Date().toISOString() })
      .eq('id', goalId)
      .select();
      
    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Error closing goal cycle:', error);
    throw error;
  }
};

// New function to close all active goals for a user in a team
export const closeAllActiveGoals = async (teamId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('team_goals')
      .update({ cycle_end: new Date().toISOString() })
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .is('cycle_end', null)
      .select();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error closing active goals:', error);
    throw error;
  }
};

// Notification related functions
export const fetchUnreadNotificationsCount = async (userId: string) => {
  try {
    // Get pending team requests count
    const { count: requestsCount, error: requestsError } = await supabase
      .from('team_requests')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (requestsError) throw requestsError;
    
    // Get unread notifications count
    const { count: notificationsCount, error: notificationsError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (notificationsError) throw notificationsError;
    
    // Combine both counts
    return (requestsCount || 0) + (notificationsCount || 0);
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    throw error;
  }
};

export const markNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

export const createNotification = async (userId: string, message: string, relatedTo: string, relatedId?: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        message,
        related_to: relatedTo,
        related_id: relatedId,
        read: false
      }])
      .select();
      
    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
