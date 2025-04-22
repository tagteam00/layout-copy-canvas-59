
// Custom types for Supabase data
// These augment the auto-generated types from src/integrations/supabase/types.ts

import { Database } from '@/integrations/supabase/types';

// Create type aliases for commonly used types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Extended UserData type that combines our local UserData with Supabase Profile
export interface UserData {
  fullName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  interests: string[];
  commitmentLevel: string;
}

// Helper function to convert between UserData and Profile formats if needed
export const userDataToProfile = (userData: UserData, userId: string): ProfileInsert => {
  return {
    id: userId,
    full_name: userData.fullName,
    username: userData.username,
    date_of_birth: new Date(userData.dateOfBirth),
    gender: userData.gender,
    interests: userData.interests,
    commitment_level: userData.commitmentLevel
  };
};

export const profileToUserData = (profile: Profile): UserData => {
  return {
    fullName: profile.full_name || '',
    username: profile.username || '',
    dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
    gender: profile.gender || '',
    interests: profile.interests || [],
    commitmentLevel: profile.commitment_level || ''
  };
};
