
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface NoAvailablePartnersAlertProps {
  selectedCategory: string;
}

export const NoAvailablePartnersAlert: React.FC<NoAvailablePartnersAlertProps> = ({
  selectedCategory
}) => {
  return (
    <Alert className="bg-amber-50 border-amber-200 mt-4">
      <AlertTitle>No available partners</AlertTitle>
      <AlertDescription>
        No users interested in {selectedCategory} are available for pairing right now. Users can only have one active TagTeam per interest.
      </AlertDescription>
    </Alert>
  );
};
