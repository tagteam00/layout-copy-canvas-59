
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
  occupation?: string;
  bio?: string;
}

export type Profile = Tables<"profiles">;
export type ProfileInsert = Tables<"profiles">;
export type TeamRequest = Tables<"team_requests">;
export type Team = Tables<"teams">;
export type Interest = Tables<"interests">;

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
    occupation: userData.occupation,
    bio: userData.bio,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
    occupation: profile.occupation || '',
    bio: profile.bio || ''
  };
};
