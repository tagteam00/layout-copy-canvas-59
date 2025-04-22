
import { supabase } from '@/integrations/supabase/client';
import { UserData, profileToUserData, userDataToProfile } from '@/types/supabase';
import { useState } from 'react';
import { toast } from 'sonner';

export type { UserData };

export const useUserData = () => {
  const [loading, setLoading] = useState(false);

  const saveUserData = async (data: UserData) => {
    setLoading(true);
    
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        throw new Error('Not authenticated');
      }
      
      const profileData = userDataToProfile(data, authData.user.id);
      
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select();
        
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Error saving user data:', error.message);
      toast.error('Failed to save profile data');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async (): Promise<UserData | null> => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', authData.user.id)
        .single();
      
      if (error || !data) {
        console.error('Error fetching profile:', error?.message);
        return null;
      }
      
      return profileToUserData(data);
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  const getAllUsers = async (): Promise<UserData[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select();
      
      if (error) {
        throw error;
      }
      
      return (data || []).map(profileToUserData);
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  };

  return { saveUserData, getUserData, getAllUsers, loading };
};
