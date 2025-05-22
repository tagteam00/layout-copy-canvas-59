
import { supabase } from '@/integrations/supabase/client';
import { UserData, profileToUserData, userDataToProfile } from '@/types/supabase';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export type { UserData };

export const useUserData = () => {
  const [loading, setLoading] = useState(false);

  // Upload profile image to Supabase storage
  const uploadProfileImage = useCallback(async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading profile image:', error.message);
      return null;
    }
  }, []);

  const saveUserData = useCallback(async (data: UserData, profileImage?: File | null) => {
    setLoading(true);
    
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        throw new Error('Not authenticated');
      }
      
      const profileData = userDataToProfile(data, authData.user.id);
      
      // If a new profile image is provided, upload it
      if (profileImage) {
        const imageUrl = await uploadProfileImage(profileImage, authData.user.id);
        if (imageUrl) {
          profileData.avatar_url = imageUrl;
        }
      } else if (profileImage === null) {
        // If explicitly set to null, remove the avatar
        profileData.avatar_url = null;
      }
      
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
  }, [uploadProfileImage]);

  const getUserData = useCallback(async (): Promise<UserData | null> => {
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
  }, []);

  const getUserDataById = useCallback(async (userId: string): Promise<UserData | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        console.error('Error fetching user profile by ID:', error?.message);
        return null;
      }
      
      return profileToUserData(data);
    } catch (error) {
      console.error('Error getting user data by ID:', error);
      return null;
    }
  }, []);

  const getAllUsers = useCallback(async (): Promise<UserData[]> => {
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
  }, []);

  return { 
    saveUserData, 
    getUserData, 
    getUserDataById, 
    getAllUsers, 
    uploadProfileImage, 
    loading 
  };
};
