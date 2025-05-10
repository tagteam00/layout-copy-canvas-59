
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TeamActivity } from '@/types/tagteam';

// Log partner activity (mark as completed or pending)
export const logPartnerActivity = async (
  teamId: string,
  partnerId: string,
  userId: string,
  status: 'completed' | 'pending',
): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    
    // Find current cycle
    const { data: currentCycle, error: cycleError } = await supabase
      .from('team_activities')
      .select('cycle_start, cycle_end')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    let cycleStart = now;
    let cycleEnd: string | null = null;
    
    if (cycleError) {
      console.error('Error fetching cycle information:', cycleError);
    } else if (currentCycle && currentCycle.length > 0) {
      cycleStart = currentCycle[0].cycle_start;
      cycleEnd = currentCycle[0].cycle_end || null;
    }

    // Create or update activity log
    const { data, error } = await supabase
      .from('team_activities')
      .upsert({
        team_id: teamId,
        user_id: partnerId,  // the user whose activity is being logged
        logged_by_user_id: userId, // the user who is doing the logging
        status,
        cycle_start: cycleStart,
        cycle_end: cycleEnd,
        created_at: now
      }, {
        onConflict: 'team_id,user_id,cycle_start',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error('Error logging partner activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logPartnerActivity:', error);
    return false;
  }
};

// Get partner activity status
export const getPartnerActivity = async (
  teamId: string,
  userId: string,
  partnerId: string
): Promise<{ userLoggedPartner: boolean; partnerLoggedUser: boolean }> => {
  try {
    // Get current cycle
    const now = new Date().toISOString();
    
    // Find activities for this team in the current cycle
    const { data, error } = await supabase
      .from('team_activities')
      .select('*')
      .eq('team_id', teamId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days as fallback
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching partner activities:', error);
      return { userLoggedPartner: false, partnerLoggedUser: false };
    }

    // Check if user has logged partner's activity
    const userLoggedPartner = data.some(
      activity => 
        activity.user_id === partnerId && 
        activity.logged_by_user_id === userId && 
        activity.status === 'completed'
    );

    // Check if partner has logged user's activity
    const partnerLoggedUser = data.some(
      activity => 
        activity.user_id === userId && 
        activity.logged_by_user_id === partnerId && 
        activity.status === 'completed'
    );

    return { userLoggedPartner, partnerLoggedUser };
  } catch (error) {
    console.error('Error in getPartnerActivity:', error);
    return { userLoggedPartner: false, partnerLoggedUser: false };
  }
};
