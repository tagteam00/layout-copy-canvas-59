
import React from "react";
import { MapLocationSelector } from "./MapLocationSelector";

interface LocationData {
  city: string;
  country: string;
  coordinates: [number, number];
  fullAddress: string;
}

interface LocationStepProps {
  onSubmit: (data: { city: string; country: string; coordinates?: [number, number]; fullAddress?: string }) => void;
  onBack: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({ onSubmit, onBack }) => {
  const handleLocationSelect = (location: LocationData) => {
    onSubmit({
      city: location.city,
      country: location.country,
      coordinates: location.coordinates,
      fullAddress: location.fullAddress
    });
  };

  return (
    <MapLocationSelector
      onLocationSelect={handleLocationSelect}
      onBack={onBack}
    />
  );
};
