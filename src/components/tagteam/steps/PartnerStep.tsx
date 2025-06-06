
import React from "react";
import { toast } from "sonner";
import { PartnerSearch } from "./partner/PartnerSearch";
import { NoAvailablePartnersAlert } from "./partner/NoAvailablePartnersAlert";
import { UsersList } from "./partner/UsersList";
import { EmptySearchState } from "./partner/EmptySearchState";
import { LoadingState } from "./partner/LoadingState";
import { usePartnerSearch } from "./partner/usePartnerSearch";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const currentUserId = user?.id || null;
  
  const {
    searchQuery,
    availableUsers,
    unavailableUsers,
    loading,
    handleSearch,
    searchResults
  } = usePartnerSearch(selectedCategory);

  const handleSelectPartner = (fullName: string, partnerId: string) => {
    // Extra check to prevent selecting self
    if (partnerId === currentUserId) {
      toast.error("You cannot select yourself as a partner");
      return;
    }
    
    onSelectPartner(fullName);
    onSelectPartnerId(partnerId);
    toast.success(`Selected ${fullName} as your TagTeam partner`);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <PartnerSearch 
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
      />

      {availableUsers.length === 0 && !loading && (
        <NoAvailablePartnersAlert selectedCategory={selectedCategory} />
      )}

      <div className="flex-1 min-h-0">
        <div className="max-h-[35vh] overflow-y-auto scrollbar-none space-y-1">
          {loading ? (
            <LoadingState />
          ) : (
            <>
              <UsersList
                users={availableUsers}
                onSelectPartner={handleSelectPartner}
                isAvailable={true}
                title="Available users"
              />
              
              <UsersList
                users={unavailableUsers}
                isAvailable={false}
                title="Users with existing TagTeams"
              />

              {availableUsers.length === 0 && unavailableUsers.length === 0 && searchResults.length === 0 && (
                <EmptySearchState selectedCategory={selectedCategory} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
