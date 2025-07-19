
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
  coordinates?: { lat: number; lng: number };
  fullAddress?: string;
  occupation?: string;
  bio?: string;
  avatarUrl?: string | null;
  instagramHandle?: string;
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
    city: userData.city || null,
    country: userData.country || null,
    coordinates: userData.coordinates ? `(${userData.coordinates.lng},${userData.coordinates.lat})` as any : null,
    full_address: userData.fullAddress || null,
    occupation: userData.occupation || null,
    bio: userData.bio || null,
    avatar_url: userData.avatarUrl,
    instagram_handle: userData.instagramHandle || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const profileToUserData = (profile: Profile): UserData => {
  let coordinates: { lat: number; lng: number } | undefined = undefined;
  
  // Parse coordinates from POINT format if available
  if (profile.coordinates) {
    try {
      const coordString = profile.coordinates.toString();
      // Handle both POINT(lng lat) and (lng,lat) formats
      const pointMatch = coordString.match(/POINT\(([^)]+)\)/);
      const parenMatch = coordString.match(/\(([^)]+)\)/);
      
      if (pointMatch) {
        const [lng, lat] = pointMatch[1].split(' ').map(Number);
        coordinates = { lat, lng };
      } else if (parenMatch) {
        const [lng, lat] = parenMatch[1].split(',').map(Number);
        coordinates = { lat, lng };
      }
    } catch (error) {
      console.warn('Failed to parse coordinates:', error);
    }
  }

  return {
    fullName: profile.full_name || '',
    username: profile.username || '',
    dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
    gender: profile.gender || '',
    interests: profile.interests || [],
    commitmentLevel: profile.commitment_level || '',
    city: profile.city || '',
    country: profile.country || '',
    coordinates,
    fullAddress: profile.full_address || '',
    occupation: profile.occupation || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatar_url,
    instagramHandle: profile.instagram_handle || ''
  };
};
