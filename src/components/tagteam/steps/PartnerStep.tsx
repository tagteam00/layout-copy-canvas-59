
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserData } from "@/types/supabase";

interface PartnerStepProps {
  selectedCategory: string;
  onSelectPartner: (partner: string) => void;
  onSelectPartnerId: (partnerId: string) => void;
}

export const PartnerStep: React.FC<PartnerStepProps> = ({
  selectedCategory,
  onSelectPartner,
  onSelectPartnerId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<UserData & { id: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
    if (!selectedCategory) return;
    setLoading(true);
    try {
      // Query for profiles containing selectedCategory in their interests,
      // and exclude current user
      let { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .contains("interests", [selectedCategory]);

      if (error) throw error;
      // Exclude self
      profiles = profiles?.filter(profile => profile.id !== currentUserId);

      // Filter by query
      let filteredProfiles = profiles;
      if (query.length >= 2) {
        filteredProfiles = profiles.filter(profile =>
          (profile.full_name ?? "").toLowerCase().includes(query.toLowerCase()) ||
          (profile.username ?? "").toLowerCase().includes(query.toLowerCase())
        );
      }

      setSearchResults((filteredProfiles || []).map(profile => ({
        id: profile.id,
        fullName: profile.full_name || '',
        username: profile.username || '',
        dateOfBirth: profile.date_of_birth || '',
        gender: profile.gender || '',
        interests: profile.interests || [],
        commitmentLevel: profile.commitment_level || ''
      })));
    } catch (error) {
      console.error('Error searching for users:', error);
      toast.error("Failed to search for users");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPartner = (fullName: string, partnerId: string) => {
    onSelectPartner(fullName);
    onSelectPartnerId(partnerId);
    toast.success(`Selected ${fullName} as your TagTeam partner`);
  };

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
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
          placeholder="Search by name or username"
        />
      </div>
      <div className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto">
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user.id}
              className="p-4 border border-[rgba(130,122,255,0.41)] rounded-xl flex items-center justify-between hover:bg-[rgba(130,122,255,0.1)] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
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
                className="flex items-center space-x-1 bg-[#827AFF] text-white px-3 py-1.5 rounded-lg hover:bg-[#827AFF]/90 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Select</span>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            {searchQuery.length > 0 
              ? "No users found matching your search" 
              : `No users found with interest in ${selectedCategory}`}
          </div>
        )}
      </div>
    </div>
  );
};
