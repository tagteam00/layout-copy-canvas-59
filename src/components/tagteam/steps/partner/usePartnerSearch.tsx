
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserWithTeamStatus {
  id: string;
  fullName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  interests: string[];
  commitmentLevel: string;
  hasActiveTeam?: boolean;
  avatarUrl?: string | null;
}

export const usePartnerSearch = (selectedCategory: string) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserWithTeamStatus[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const currentUserId = user?.id || null;

  // Filter users based on current query
  const filteredResults = searchResults.filter(user => 
    !user.hasActiveTeam && 
    (searchQuery.length < 2 || 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const unavailableUsers = searchResults.filter(user => user.hasActiveTeam);
  const availableUsers = filteredResults;

  // Auto-search for users upon interest change or when user ID becomes available
  useEffect(() => {
    if (selectedCategory && currentUserId) {
      handleSearch("");
    }
  }, [selectedCategory, currentUserId]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!selectedCategory || !currentUserId) return;
    
    setLoading(true);
    try {
      // Query for public profiles containing selectedCategory in their interests
      let {
        data: profiles,
        error
      } = await supabase.from("public_profiles").select("*").contains("interests", [selectedCategory]);
      
      if (error) throw error;
      
      // Explicitly exclude current user
      profiles = profiles?.filter(profile => profile.id !== currentUserId);

      // Filter by query
      let filteredProfiles = profiles;
      if (query.length >= 2) {
        filteredProfiles = profiles.filter(profile => 
          (profile.full_name ?? "").toLowerCase().includes(query.toLowerCase()) || 
          (profile.username ?? "").toLowerCase().includes(query.toLowerCase())
        );
      }

      // Check if each user already has an active team for this interest
      const profilesWithTeamStatus = await Promise.all((filteredProfiles || []).map(async (profile) => {
        // Get all active teams for this user with this interest
        const { data: teams } = await supabase
          .from('teams')
          .select('*')
          .contains('members', [profile.id])
          .eq('category', selectedCategory)
          .is('ended_at', null);
        
        return {
          id: profile.id,
          fullName: profile.full_name || '',
          username: profile.username || '',
          dateOfBirth: '', // Not available in public_profiles
          gender: '', // Not available in public_profiles
          interests: profile.interests || [],
          commitmentLevel: profile.commitment_level || '',
          avatarUrl: profile.avatar_url,
          hasActiveTeam: (teams?.length || 0) > 0
        };
      }));

      // Double-check to ensure current user is never in results
      const finalResults = profilesWithTeamStatus.filter(profile => profile.id !== currentUserId);
      setSearchResults(finalResults);
    } catch (error) {
      console.error('Error searching for users:', error);
      toast.error("Failed to search for users");
    } finally {
      setLoading(false);
    }
  };

  return {
    searchQuery,
    availableUsers,
    unavailableUsers,
    loading,
    handleSearch,
    searchResults
  };
};
