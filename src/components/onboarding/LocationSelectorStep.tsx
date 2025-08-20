
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  city: string;
  country: string;
  coordinates?: { lat: number; lng: number };
  fullAddress?: string;
}

interface LocationSelectorStepProps {
  onSubmit: (data: LocationData) => void;
  onBack: () => void;
}

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

export const LocationSelectorStep: React.FC<LocationSelectorStepProps> = ({ onSubmit, onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Places API
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsGoogleLoaded(true);
      initializeAutocomplete();
      return;
    }

    // For development, we'll create a fallback without requiring API key
    window.initGooglePlaces = () => {
      setIsGoogleLoaded(true);
      initializeAutocomplete();
    };

    // Load Google Places API script (commented out for now to avoid API key requirement)
    // const script = document.createElement('script');
    // script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initGooglePlaces`;
    // script.async = true;
    // script.defer = true;
    // document.head.appendChild(script);

    // For development, simulate API loading
    setTimeout(() => {
      setIsGoogleLoaded(true);
    }, 1000);
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      fields: ['place_id', 'geometry', 'name', 'address_components', 'formatted_address']
    });

    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  };

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const addressComponents = place.address_components || [];
    let city = "";
    let country = "";

    addressComponents.forEach((component: any) => {
      const types = component.types;
      if (types.includes('locality') || types.includes('administrative_area_level_1')) {
        city = component.long_name;
      }
      if (types.includes('country')) {
        country = component.long_name;
      }
    });

    const locationData: LocationData = {
      city: city || place.name,
      country,
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      fullAddress: place.formatted_address
    };

    setSelectedLocation(locationData);
    setSearchValue(place.formatted_address || `${city}, ${country}`);
  };

  // Fallback search for development (simulated)
  const handleFallbackSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock some popular cities for development
    const mockCities = [
      { city: "New York", country: "United States", fullAddress: "New York, NY, USA" },
      { city: "London", country: "United Kingdom", fullAddress: "London, UK" },
      { city: "Paris", country: "France", fullAddress: "Paris, France" },
      { city: "Tokyo", country: "Japan", fullAddress: "Tokyo, Japan" },
      { city: "Sydney", country: "Australia", fullAddress: "Sydney, NSW, Australia" }
    ];

    const matchedCity = mockCities.find(city => 
      city.city.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedCity) {
      setSelectedLocation(matchedCity);
      setSearchValue(matchedCity.fullAddress);
      toast.success("Location selected!");
    } else {
      toast.error("Location not found. Please try a different search.");
    }

    setIsLoading(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // In a real implementation, you would reverse geocode these coordinates
        // For now, we'll use a mock response
        const mockLocation: LocationData = {
          city: "Your City", // Would be resolved from coordinates
          country: "Your Country", // Would be resolved from coordinates
          coordinates: { lat: latitude, lng: longitude },
          fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        };

        setSelectedLocation(mockLocation);
        setSearchValue(mockLocation.fullAddress!);
        setIsLoading(false);
        toast.success("Current location detected!");
      },
      (error) => {
        setIsLoading(false);
        toast.error("Unable to retrieve your location. Please search manually.");
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

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGoogleLoaded) {
      e.preventDefault();
      handleFallbackSearch(searchValue);
    }
  };

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
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-10 border border-[rgba(130,122,255,0.41)] rounded-xl"
            disabled={isLoading}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
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
                  {selectedLocation.city}, {selectedLocation.country}
                </p>
                {selectedLocation.fullAddress && (
                  <p className="text-sm text-green-600">{selectedLocation.fullAddress}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!isGoogleLoaded && (
          <p className="text-xs text-gray-500 text-center">
            Development mode: Enter a city name and press Enter to search
          </p>
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
