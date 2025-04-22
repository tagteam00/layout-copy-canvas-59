import { supabase } from '@/integrations/supabase/client';
import { UserData, profileToUserData, userDataToProfile } from '@/types/supabase';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export type { UserData };

export const useUserData = () => {
  const [loading, setLoading] = useState(false);

  const saveUserData = async (data: UserData) => {
    setLoading(true);
    
    try {
      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        throw new Error('Not authenticated');
      }
      
      // Convert UserData to Profile format
      const profileData = userDataToProfile(data, authData.user.id);
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select();
        
      if (error) throw error;
      
      // Still keep local storage for backward compatibility
      localStorage.setItem('userData', JSON.stringify(data));
      
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
      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        // Return data from localStorage as fallback
        const localData = localStorage.getItem('userData');
        return localData ? JSON.parse(localData) : null;
      }
      
      // Get profile from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', authData.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error.message);
        // Fall back to localStorage
        const localData = localStorage.getItem('userData');
        return localData ? JSON.parse(localData) : null;
      }
      
      if (!data) return null;
      
      // Convert Profile to UserData format
      return profileToUserData(data);
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  const getAllUsers = async (): Promise<UserData[]> => {
    try {
      // Get all profiles from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select();
      
      if (error) {
        throw error;
      }
      
      if (!data) return [];
      
      // Convert Profile[] to UserData[]
      return data.map(profileToUserData);
    } catch (error) {
      console.error('Error getting all users:', error);
      
      // Fall back to localStorage if Supabase fails
      const localData = localStorage.getItem('usersData');
      return localData ? JSON.parse(localData) : [];
    }
  };

  return { saveUserData, getUserData, getAllUsers, loading };
};
