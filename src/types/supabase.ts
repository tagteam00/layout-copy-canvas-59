
import { Tables } from "@/integrations/supabase/types";

export interface UserData {
  fullName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  interests: string[];
  commitmentLevel: string;
  city?: string;
  country?: string;
  coordinates?: [number, number];
  fullAddress?: string;
  occupation?: string;
  bio?: string;
  avatarUrl?: string | null;
}

// Define the Profile type based on the Supabase profiles table
type Profile = Tables<"profiles">;
// Define the ProfileInsert type for inserting into the profiles table
type ProfileInsert = Tables<"profiles">;

export const userDataToProfile = (userData: UserData, userId: string): ProfileInsert => {
  return {
    id: userId,
    full_name: userData.fullName,
    username: userData.username,
    date_of_birth: userData.dateOfBirth,
    gender: userData.gender,
    interests: userData.interests,
    commitment_level: userData.commitmentLevel,
    city: userData.city,
    country: userData.country,
    coordinates: userData.coordinates,
    full_address: userData.fullAddress,
    occupation: userData.occupation,
    bio: userData.bio,
    avatar_url: userData.avatarUrl,
    created_at: new Date().toISOString(), // Add current timestamp
    updated_at: new Date().toISOString()  // Add current timestamp
  };
};

export const profileToUserData = (profile: Profile): UserData => {
  return {
    fullName: profile.full_name || '',
    username: profile.username || '',
    dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
    gender: profile.gender || '',
    interests: profile.interests || [],
    commitmentLevel: profile.commitment_level || '',
    city: profile.city || '',
    country: profile.country || '',
    coordinates: profile.coordinates as [number, number] | undefined,
    fullAddress: profile.full_address || '',
    occupation: profile.occupation || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatar_url
  };
};
