
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  city: string;
  state?: string;
  country: string;
  coordinates?: { lat: number; lng: number };
  fullAddress?: string;
}

interface LocationSelectorStepProps {
  onSubmit: (data: LocationData) => void;
  onBack: () => void;
}

// Fallback cities for search
const fallbackCities: LocationData[] = [
  { city: "New York", state: "NY", country: "United States" },
  { city: "Los Angeles", state: "CA", country: "United States" },
  { city: "Chicago", state: "IL", country: "United States" },
  { city: "Houston", state: "TX", country: "United States" },
  { city: "Phoenix", state: "AZ", country: "United States" },
  { city: "Philadelphia", state: "PA", country: "United States" },
  { city: "San Antonio", state: "TX", country: "United States" },
  { city: "San Diego", state: "CA", country: "United States" },
  { city: "Dallas", state: "TX", country: "United States" },
  { city: "San Jose", state: "CA", country: "United States" },
  { city: "London", country: "United Kingdom" },
  { city: "Manchester", country: "United Kingdom" },
  { city: "Birmingham", country: "United Kingdom" },
  { city: "Glasgow", country: "Scotland" },
  { city: "Toronto", country: "Canada" },
  { city: "Vancouver", country: "Canada" },
  { city: "Montreal", country: "Canada" },
  { city: "Sydney", country: "Australia" },
  { city: "Melbourne", country: "Australia" },
  { city: "Brisbane", country: "Australia" },
  { city: "Mumbai", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Bangalore", country: "India" },
  { city: "Hyderabad", country: "India" },
  { city: "Chennai", country: "India" },
  { city: "Kolkata", country: "India" },
  { city: "Pune", country: "India" },
  { city: "Ahmedabad", country: "India" },
  { city: "Tokyo", country: "Japan" },
  { city: "Osaka", country: "Japan" },
  { city: "Berlin", country: "Germany" },
  { city: "Munich", country: "Germany" },
  { city: "Paris", country: "France" },
  { city: "Lyon", country: "France" },
  { city: "Madrid", country: "Spain" },
  { city: "Barcelona", country: "Spain" },
  { city: "Rome", country: "Italy" },
  { city: "Milan", country: "Italy" }
];

export const LocationSelectorStep: React.FC<LocationSelectorStepProps> = ({ onSubmit, onBack }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleLocationSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setError(null);
      return;
    }

    console.log('[LocationSelectorStep] Searching for:', query);
    setIsSearching(true);
    setError(null);
    
    // Simple local search through fallback cities
    const matchedCities = fallbackCities.filter(city => 
      city.city.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase()) ||
      (city.state && city.state.toLowerCase().includes(query.toLowerCase()))
    );
    
    setTimeout(() => {
      console.log('[LocationSelectorStep] Search results:', matchedCities);
      
      setSearchResults(matchedCities);
      setShowResults(true);
      setIsSearching(false);
      
      if (matchedCities.length === 0) {
        setError("No locations found. Try a different search term.");
        toast.error("Location not found. Please try a different search term.");
      } else {
        setError(null);
      }
    }, 300); // Simulate search delay
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setError(null);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      handleLocationSearch(value);
    }, 300);
  };

  const selectLocation = (location: LocationData) => {
    console.log('[LocationSelectorStep] Location selected:', location);
    const displayText = `${location.city}${location.state ? `, ${location.state}` : ''}, ${location.country}`;
    
    setSelectedLocation(location);
    setSearchValue(displayText);
    setShowResults(false);
    setSearchResults([]);
    setError(null);
    
    toast.success("Location selected!");
  };

  const handleSubmit = () => {
    if (!selectedLocation) {
      toast.error("Please select a location first.");
      return;
    }
    
    console.log('[LocationSelectorStep] Submitting location:', selectedLocation);
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

      {/* Error display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

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
            disabled={isSearching}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
          )}
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
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

        {selectedLocation && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">
                  {selectedLocation.city}
                  {selectedLocation.state && `, ${selectedLocation.state}`}, {selectedLocation.country}
                </p>
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
          disabled={!selectedLocation || isSearching}
          className="bg-black text-white hover:bg-black/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
