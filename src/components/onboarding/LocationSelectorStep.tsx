
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface LocationSelectorStepProps {
  onNext: () => void;
  onLocationSelect: (location: string) => void;
  selectedLocation?: string;
}

const LocationSelectorStep: React.FC<LocationSelectorStepProps> = ({
  onNext,
  onLocationSelect,
  selectedLocation = ''
}) => {
  const [searchLocation, setSearchLocation] = useState(selectedLocation);

  const handleLocationChange = (value: string) => {
    setSearchLocation(value);
    onLocationSelect(value);
  };

  const handleNext = () => {
    if (searchLocation.trim()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Where are you located?</h2>
        <p className="text-gray-600">
          This helps us connect you with accountability partners in your area
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location-search">Enter your city or area</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="location-search"
              type="text"
              placeholder="e.g., New York, London, Mumbai..."
              value={searchLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>• Enter your city, neighborhood, or general area</p>
          <p>• This helps us suggest relevant accountability partners</p>
          <p>• You can update this later in your profile</p>
        </div>
      </div>

      <Button 
        onClick={handleNext}
        disabled={!searchLocation.trim()}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
};

export default LocationSelectorStep;
