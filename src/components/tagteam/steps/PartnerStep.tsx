
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PartnerStepProps {
  selectedCategory: string;
  onSelectPartner: (partner: string) => void;
}

export const PartnerStep: React.FC<PartnerStepProps> = ({
  selectedCategory,
  onSelectPartner,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Simulated search using localStorage data
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const filtered = users.filter((user: any) => 
      user.interests?.includes(selectedCategory) &&
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered.map((user: any) => user.username));
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
        {searchResults.map((username) => (
          <div
            key={username}
            onClick={() => onSelectPartner(username)}
            className="p-3 border border-[rgba(130,122,255,0.41)] rounded-xl cursor-pointer hover:bg-[rgba(130,122,255,0.1)]"
          >
            {username}
          </div>
        ))}
      </div>
    </div>
  );
};
