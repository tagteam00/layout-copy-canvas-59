
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
      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      // Verify authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      // Delete existing avatar if any
      const { data: existingFiles, error: listError } = await supabase.storage
        .from('avatars')
        .list(`${userId}/`, { limit: 100 });
      
      if (listError) {
        console.warn('Could not list existing files:', listError);
      }
      
      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(file => `${userId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove(filesToDelete);
        
        if (deleteError) {
          console.warn('Could not delete existing files:', deleteError);
        }
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      if (!publicUrl) {
        throw new Error('Failed to obtain public URL for uploaded image');
      }

      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading profile image:', error?.message || error);
      throw error; // Re-throw to allow proper error handling
    }
  }, []);

  const saveUserData = useCallback(async (data: UserData, profileImage?: File | null) => {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        setLoading(true);
        
        // Check network connectivity
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please check your network and try again.');
        }
        
        // Get current user with retry
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          throw new Error('Authentication required. Please sign in again.');
        }

        // Validate required fields
        if (!data.fullName?.trim()) {
          throw new Error('Full name is required');
        }
        if (!data.username?.trim()) {
          throw new Error('Username is required');
        }

        // Validate Instagram URL if provided
        if (data.instagramUrl && !/^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//.test(data.instagramUrl)) {
          throw new Error('Invalid Instagram URL format');
        }

        let profileData = userDataToProfile(data, authData.user.id);
        
        // If a new profile image is provided, upload it
        if (profileImage) {
          try {
            const imageUrl = await uploadProfileImage(profileImage, authData.user.id);
            if (imageUrl) {
              profileData.avatar_url = imageUrl;
            } else {
              throw new Error('Failed to upload profile image');
            }
          } catch (uploadError) {
            console.error('Image upload failed:', uploadError);
            throw new Error(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
          }
        } else if (profileImage === null) {
          // If explicitly set to null, remove the avatar
          profileData.avatar_url = null;
        }

        // No need to check for existing profile or manage timestamps manually
        // Database will handle created_at and updated_at automatically
        
        console.log('About to save profile data:', profileData);
        
        const { error } = await supabase
          .from('profiles')
          .upsert(profileData)
          .select();
          
        if (error) {
          console.error('Supabase upsert error:', error);
          
          // Check for specific Instagram URL validation error
          if (error.message?.includes('Invalid Instagram URL format') || 
              error.message?.includes('instagram_url')) {
            throw new Error('Instagram URL format is invalid. Please enter a valid Instagram URL (e.g., https://instagram.com/username).');
          }
          
          // Check for profile validation trigger errors
          if (error.message?.includes('validate_profile_instagram_url')) {
            throw new Error('Profile data validation failed. Please check your Instagram URL format.');
          }
          
          // Check for other validation errors
          if (error.message?.includes('violates check constraint') || 
              error.message?.includes('validation') ||
              error.message?.includes('trigger')) {
            throw new Error('Please check that all fields are filled out correctly.');
          }
          
          throw new Error(`Failed to save profile: ${error.message}`);
        }
        
        console.log('Profile data saved successfully');
        return true;
        
      } catch (error: any) {
        attempt++;
        console.error(`Attempt ${attempt} failed:`, error);
        
        // If this was the last attempt, show error and return false
        if (attempt >= maxRetries) {
          const errorMessage = error.message || 'Failed to save profile';
          console.error('Final attempt failed:', errorMessage);
          toast.error(errorMessage);
          return false;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      } finally {
        if (attempt >= maxRetries || attempt === 0) {
          setLoading(false);
        }
      }
    }
    
    return false;
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


  const getAllUsers = useCallback(async (): Promise<UserData[]> => {
    try {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('id, full_name, username, interests, commitment_level, avatar_url');
      
      if (error) {
        throw error;
      }
      
      // Map limited public profile data to UserData format with defaults
      return (data || []).map(profile => ({
        fullName: profile.full_name || '',
        username: profile.username || '',
        dateOfBirth: '', // Not available in public profiles
        gender: '', // Not available in public profiles
        interests: profile.interests || [],
        commitmentLevel: profile.commitment_level || '',
        city: '', // Not available in public profiles
        country: '', // Not available in public profiles
        occupation: '', // Not available in public profiles
        bio: '', // Not available in public profiles
        avatarUrl: profile.avatar_url,
        instagramUrl: '' // Not available in public profiles
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }, []);

  return { 
    saveUserData, 
    getUserData, 
    getAllUsers, 
    uploadProfileImage, 
    loading 
  };
};
