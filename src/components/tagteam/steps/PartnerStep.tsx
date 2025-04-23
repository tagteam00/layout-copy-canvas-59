
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserData } from "@/types/supabase";

interface PartnerStepProps {
  selectedCategory: string;
  onSelectPartner: (partner: string) => void;
}

export const PartnerStep: React.FC<PartnerStepProps> = ({
  selectedCategory,
  onSelectPartner,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Fixed: Use the containedBy operator (@>) to check if the interests array contains the selectedCategory
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .contains('interests', [selectedCategory])  // Fixed using .contains to properly filter array values
        .neq('id', currentUserId)
        .limit(5);

      if (error) throw error;

      setSearchResults(profiles.map(profile => ({
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

  const handleSelectPartner = (fullName: string) => {
    onSelectPartner(fullName);
    toast.success(`Selected ${fullName} as your TagTeam partner`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
          placeholder="Search for partners"
        />
      </div>
      
      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user.username}
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
                onClick={() => handleSelectPartner(user.fullName)}
                className="flex items-center space-x-1 bg-[#827AFF] text-white px-3 py-1.5 rounded-lg hover:bg-[#827AFF]/90 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Select</span>
              </button>
            </div>
          ))
        ) : searchQuery.length > 0 ? (
          <div className="text-center text-gray-500 py-4">
            No users found matching your search
          </div>
        ) : null}
      </div>
    </div>
  );
};
