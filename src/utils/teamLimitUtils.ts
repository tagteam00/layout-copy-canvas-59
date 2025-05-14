
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MAX_ALLOWED_TAGTEAMS = 3;

/**
 * Check if a user can join more tag teams
 * @param userId The user ID to check
 * @returns Object containing isAtLimit boolean and count of active teams
 */
export const checkTagTeamLimit = async (userId: string): Promise<{isAtLimit: boolean, count: number}> => {
  try {
    // Count active teams (where ended_at is null)
    const { data: teams, error, count } = await supabase
      .from('teams')
      .select('id', { count: 'exact' })
      .contains('members', [userId])
      .is('ended_at', null);
      
    if (error) throw error;
    
    const activeTeamCount = count || 0;
    return {
      isAtLimit: activeTeamCount >= MAX_ALLOWED_TAGTEAMS,
      count: activeTeamCount
    };
  } catch (error) {
    console.error('Error checking team limit:', error);
    toast.error("Couldn't check your team limit");
    // Default to false to avoid blocking users when there's an error
    return { isAtLimit: false, count: 0 };
  }
};

/**
 * Get the remaining tag team slots for a user
 * @param userId The user ID to check
 * @returns The number of remaining tag team slots or null if there was an error
 */
export const getRemainingTagTeamSlots = async (userId: string): Promise<number | null> => {
  try {
    const { isAtLimit, count } = await checkTagTeamLimit(userId);
    return MAX_ALLOWED_TAGTEAMS - count;
  } catch (error) {
    return null;
  }
};

/**
 * Check if this is the first time the user is encountering the limit
 * and show an educational message if so
 * @param userId The user ID to check
 */
export const checkFirstTimeLimitEncounter = async (userId: string): Promise<boolean> => {
  // This would ideally check against a user preference in the database
  // For now, we'll use localStorage as a simple implementation
  const key = `tagteam-limit-encountered-${userId}`;
  const hasEncounteredLimit = localStorage.getItem(key);
  
  if (!hasEncounteredLimit) {
    localStorage.setItem(key, 'true');
    return true;
  }
  
  return false;
};
