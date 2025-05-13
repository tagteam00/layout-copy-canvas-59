
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getLatestActivityStatus, logActivityStatus } from '@/services/activityService';
import { toast } from 'sonner';

export const useTeamActivity = (teamId: string, currentUserId: string) => {
  const [firstUserStatus, setFirstUserStatus] = useState<"completed" | "pending">("pending");
  const [secondUserStatus, setSecondUserStatus] = useState<"completed" | "pending">("pending");
  const [loading, setLoading] = useState(true);

  // Load initial activity statuses
  useEffect(() => {
    const loadActivities = async () => {
      if (!teamId || !currentUserId) return;
      
      try {
        setLoading(true);
        
        // Get team info to determine users
        const { data: teamData } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamId)
          .single();
          
        if (!teamData) return;
        
        // Get status for each user
        const firstUserId = teamData.members[0];
        const secondUserId = teamData.members[1];
        
        const firstUserStatusData = await getLatestActivityStatus(teamId, firstUserId);
        const secondUserStatusData = await getLatestActivityStatus(teamId, secondUserId);
        
        setFirstUserStatus(firstUserStatusData as "completed" | "pending");
        setSecondUserStatus(secondUserStatusData as "completed" | "pending");
      } catch (error) {
        console.error('Error loading activities:', error);
        toast.error("Failed to load activity statuses");
      } finally {
        setLoading(false);
      }
    };
    
    loadActivities();
  }, [teamId, currentUserId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!teamId) return;
    
    const channel = supabase
      .channel(`team_activities:${teamId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'team_activities',
          filter: `team_id=eq.${teamId}`
        }, 
        async (payload) => {
          // Refresh statuses when activities are updated
          try {
            // Get team info to determine users
            const { data: teamData } = await supabase
              .from('teams')
              .select('*')
              .eq('id', teamId)
              .single();
              
            if (!teamData) return;
            
            // Get status for each user
            const firstUserId = teamData.members[0];
            const secondUserId = teamData.members[1];
            
            const firstUserStatusData = await getLatestActivityStatus(teamId, firstUserId);
            const secondUserStatusData = await getLatestActivityStatus(teamId, secondUserId);
            
            setFirstUserStatus(firstUserStatusData as "completed" | "pending");
            setSecondUserStatus(secondUserStatusData as "completed" | "pending");
          } catch (error) {
            console.error('Error updating activities:', error);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  // Function to update partner's status
  const updatePartnerStatus = useCallback(async (
    partnerId: string, 
    status: "completed" | "pending"
  ) => {
    if (!teamId || !currentUserId || !partnerId) return false;
    
    try {
      const result = await logActivityStatus(teamId, partnerId, currentUserId, status);
      return result !== null;
    } catch (error) {
      console.error('Error updating partner status:', error);
      toast.error("Failed to update partner's status");
      return false;
    }
  }, [teamId, currentUserId]);

  return {
    firstUserStatus,
    secondUserStatus,
    updatePartnerStatus,
    loading
  };
};
