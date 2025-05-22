
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PartnerSearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedCategory: string;
}

export const PartnerSearch: React.FC<PartnerSearchProps> = ({
  searchQuery,
  onSearch,
  selectedCategory
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Finding users who are interested in <span className="bg-[rgba(130,122,255,1)] text-white px-2 py-1 rounded-full text-xs">{selectedCategory}</span>
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => onSearch(e.target.value)} 
          className="pl-10 w-full border border-[rgba(130,122,255,0.41)] rounded-xl" 
          placeholder="Search by name or username" 
        />
      </div>
    </div>
  );
};
