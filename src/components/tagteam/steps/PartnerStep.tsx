
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserData } from "@/types/supabase";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PartnerStepProps {
  selectedCategory: string;
  onSelectPartner: (partner: string) => void;
  onSelectPartnerId: (partnerId: string) => void;
}

export const PartnerStep: React.FC<PartnerStepProps> = ({
  selectedCategory,
  onSelectPartner,
  onSelectPartnerId
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<UserData & {
    id: string;
    hasActiveTeam?: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
    // Auto-search for users upon interest change
    if (selectedCategory) {
      handleSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!selectedCategory || !currentUserId) return;
    setLoading(true);
    try {
      // Query for profiles containing selectedCategory in their interests,
      // and explicitly exclude current user
      let {
        data: profiles,
        error
      } = await supabase
        .from("profiles")
        .select("*")
        .contains("interests", [selectedCategory])
        .neq('id', currentUserId); // Explicitly exclude the current user
        
      if (error) throw error;

      // Filter by query only if it has 2 or more characters
      let filteredProfiles = profiles || [];
      if (query.length >= 2) {
        filteredProfiles = filteredProfiles.filter(profile => 
          (profile.full_name ?? "").toLowerCase().includes(query.toLowerCase()) || 
          (profile.username ?? "").toLowerCase().includes(query.toLowerCase())
        );
      }

      // Check if each user already has an active team for this interest
      const profilesWithTeamStatus = await Promise.all(filteredProfiles.map(async (profile) => {
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
          dateOfBirth: profile.date_of_birth || '',
          gender: profile.gender || '',
          interests: profile.interests || [],
          commitmentLevel: profile.commitment_level || '',
          avatarUrl: profile.avatar_url, // Include avatar URL
          hasActiveTeam: (teams?.length || 0) > 0
        };
      }));

      setSearchResults(profilesWithTeamStatus);
    } catch (error) {
      console.error('Error searching for users:', error);
      toast.error("Failed to search for users");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPartner = (fullName: string, partnerId: string) => {
    // Additional safety check to prevent selecting yourself
    if (partnerId === currentUserId) {
      toast.error("You cannot select yourself as a partner");
      return;
    }
    
    onSelectPartner(fullName);
    onSelectPartnerId(partnerId);
    toast.success(`Selected ${fullName} as your TagTeam partner`);
  };

  const availableUsers = searchResults.filter(user => !user.hasActiveTeam);
  const unavailableUsers = searchResults.filter(user => user.hasActiveTeam);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Finding users who are interested in <Badge className="bg-[rgba(130,122,255,1)]">{selectedCategory}</Badge>
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          type="text" 
          value={searchQuery} 
          onChange={e => handleSearch(e.target.value)} 
          className="pl-10 w-full border border-[rgba(130,122,255,0.41)] rounded-xl" 
          placeholder="Search by name or username" 
        />
      </div>

      {availableUsers.length === 0 && !loading && searchResults.length === 0 && (
        <Alert className="bg-amber-50 border-amber-200 mt-4">
          <AlertTitle>No available partners</AlertTitle>
          <AlertDescription>
            No users interested in {selectedCategory} are available for pairing right now. Users can only have one active TagTeam per interest.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto">
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>)}
          </div>
        ) : availableUsers.length > 0 ? (
          <>
            <h3 className="text-sm font-medium text-gray-700">Available users</h3>
            {availableUsers.map(user => (
              <div key={user.id} className="p-4 border border-[rgba(130,122,255,0.41)] rounded-xl flex items-center justify-between hover:bg-[rgba(130,122,255,0.1)] transition-colors">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    {user.avatarUrl && (
                      <AvatarImage 
                        src={user.avatarUrl} 
                        alt={user.fullName || "User"}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback>
                      {user.fullName?.charAt(0) || user.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleSelectPartner(user.fullName, user.id)} 
                  className="flex items-center space-x-1 text-white px-3 py-1.5 rounded-lg transition-colors bg-gray-950 hover:bg-gray-800"
                >
                  <span>Select</span>
                </button>
              </div>
            ))}
          </>
        ) : searchQuery.length > 0 ? (
          <div className="text-center text-gray-500 py-4">
            No users found matching your search
          </div>
        ) : null}

        {unavailableUsers.length > 0 && (
          <>
            <h3 className="text-sm font-medium text-gray-700 mt-6">Users with existing {selectedCategory} TagTeams</h3>
            {unavailableUsers.map(user => (
              <div key={user.id} className="p-4 border border-gray-200 bg-gray-50 rounded-xl flex items-center justify-between opacity-70">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    {user.avatarUrl && (
                      <AvatarImage 
                        src={user.avatarUrl} 
                        alt={user.fullName || "User"}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback>
                      {user.fullName?.charAt(0) || user.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 py-1 px-2 bg-gray-100 rounded">
                  Has active team
                </span>
              </div>
            ))}
          </>
        )}

        {availableUsers.length === 0 && unavailableUsers.length === 0 && !loading && searchQuery.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            {`No users found with interest in ${selectedCategory}`}
          </div>
        )}
      </div>
    </div>
  );
};
