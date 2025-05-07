
import { supabase } from '@/integrations/supabase/client';

export const fetchTeamGoal = async (teamId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('team_goals')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', userId)
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
    const { data, error } = await supabase
      .from('team_goals')
      .insert([{
        team_id: teamId,
        user_id: userId,
        goal,
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
