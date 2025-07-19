
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { geolocationService, LocationData } from "@/services/geolocationService";

interface LocationSelectorStepProps {
  onSubmit: (data: LocationData) => void;
  onBack: () => void;
}

export const LocationSelectorStep: React.FC<LocationSelectorStepProps> = ({ onSubmit, onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleLocationSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const results = await geolocationService.searchLocation(query);
      
      if (results.length > 0) {
        setSearchResults(results);
        setShowResults(true);
      } else {
        // Fallback to local city database
        const fallbackCities = geolocationService.getFallbackCities();
        const matchedCities = fallbackCities.filter(city => 
          city.city.toLowerCase().includes(query.toLowerCase()) ||
          city.country.toLowerCase().includes(query.toLowerCase())
        );
        
        setSearchResults(matchedCities);
        setShowResults(true);
        
        if (matchedCities.length === 0) {
          toast.error("Location not found. Please try a different search.");
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Search failed. Please try again.");
      setSearchResults([]);
      setShowResults(false);
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      handleLocationSearch(value);
    }, 300);
  };

  const selectLocation = (location: LocationData) => {
    setSelectedLocation(location);
    setSearchValue(`${location.city}, ${location.state ? location.state + ', ' : ''}${location.country}`);
    setShowResults(false);
    setSearchResults([]);
    toast.success("Location selected!");
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    console.log('Requesting current location...');
    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Got position:', { latitude, longitude });
        
        try {
          const locationData = await geolocationService.reverseGeocode(latitude, longitude);
          console.log('Reverse geocoding result:', locationData);
          
          if (locationData) {
            setSelectedLocation(locationData);
            setSearchValue(`${locationData.city}, ${locationData.state ? locationData.state + ', ' : ''}${locationData.country}`);
            toast.success("Current location detected!");
          } else {
            console.error('Reverse geocoding returned null');
            throw new Error("Could not determine location");
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          toast.error("Could not determine your location. Please search manually.");
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoading(false);
        
        let errorMessage = "Unable to retrieve your location. Please search manually.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please search manually.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleSubmit = () => {
    if (!selectedLocation) {
      toast.error("Please select a location first.");
      return;
    }
    onSubmit(selectedLocation);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      selectLocation(searchResults[0]);
    }
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Where are you located?</h2>
        <p className="text-gray-600 text-sm">This helps us connect you with nearby partners</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for your city..."
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-10 border border-[rgba(130,122,255,0.41)] rounded-xl"
            disabled={isLoading}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
          )}
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => selectLocation(location)}
                >
                  <div className="font-medium text-gray-900">
                    {location.city}{location.state && `, ${location.state}`}
                  </div>
                  <div className="text-sm text-gray-500">{location.country}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>

        {selectedLocation && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">
                  {selectedLocation.city}{selectedLocation.state && `, ${selectedLocation.state}`}, {selectedLocation.country}
                </p>
                {selectedLocation.coordinates && (
                  <p className="text-sm text-green-600">
                    Lat: {selectedLocation.coordinates.lat.toFixed(4)}, Lng: {selectedLocation.coordinates.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedLocation || isLoading}
          className="bg-black text-white hover:bg-black/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
