
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2, AlertCircle, RefreshCw, Info, Shield } from "lucide-react";
import { toast } from "sonner";
import { geolocationService, LocationData, GeolocationError } from "@/services/geolocationService";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationSelectorStepProps {
  onSubmit: (data: LocationData) => void;
  onBack: () => void;
}

interface LocationState {
  isDetecting: boolean;
  isSearching: boolean;
  searchValue: string;
  selectedLocation: LocationData | null;
  searchResults: LocationData[];
  showResults: boolean;
  error: string | null;
  permissionDenied: boolean;
  canUseGeolocation: boolean;
}

export const LocationSelectorStep: React.FC<LocationSelectorStepProps> = ({ onSubmit, onBack }) => {
  const [state, setState] = useState<LocationState>({
    isDetecting: false,
    isSearching: false,
    searchValue: "",
    selectedLocation: null,
    searchResults: [],
    showResults: false,
    error: null,
    permissionDenied: false,
    canUseGeolocation: false // Will be set in useEffect
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Simple geolocation availability check
  useEffect(() => {
    console.log('[LocationSelectorStep] Component mounted');
    
    // Simple feature detection without problematic security context calls
    const hasGeolocation = 'geolocation' in navigator;
    const isHttps = window.location.protocol === 'https:';
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    const canUse = hasGeolocation && (isHttps || isLocalhost);
    
    console.log('[LocationSelectorStep] Simple geolocation check:', {
      hasGeolocation,
      isHttps,
      isLocalhost,
      canUse
    });
    
    setState(prev => ({ ...prev, canUseGeolocation: canUse }));
    
    if (!canUse) {
      let message = "Location detection is not available. ";
      if (!hasGeolocation) {
        message += "Your browser doesn't support location detection.";
      } else {
        message += "Please use the search function instead.";
      }
      setState(prev => ({ 
        ...prev, 
        error: message
      }));
    }
  }, []);

  const handleLocationSearch = async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ 
        ...prev, 
        searchResults: [], 
        showResults: false,
        error: null 
      }));
      return;
    }

    console.log('[LocationSelectorStep] Starting location search for:', query);
    setState(prev => ({ ...prev, isSearching: true, error: null }));
    
    try {
      const results = await geolocationService.searchLocation(query);
      console.log('[LocationSelectorStep] Search results received:', results);
      
      if (results.length > 0) {
        setState(prev => ({
          ...prev,
          searchResults: results,
          showResults: true,
          isSearching: false,
          error: null
        }));
      } else {
        console.log('[LocationSelectorStep] No API results, trying fallback cities');
        const fallbackCities = geolocationService.getFallbackCities();
        const matchedCities = fallbackCities.filter(city => 
          city.city.toLowerCase().includes(query.toLowerCase()) ||
          city.country.toLowerCase().includes(query.toLowerCase()) ||
          (city.state && city.state.toLowerCase().includes(query.toLowerCase()))
        );
        
        console.log('[LocationSelectorStep] Fallback cities matched:', matchedCities);
        
        setState(prev => ({
          ...prev,
          searchResults: matchedCities,
          showResults: true,
          isSearching: false,
          error: matchedCities.length === 0 ? "No locations found. Try a different search term." : null
        }));
        
        if (matchedCities.length === 0) {
          toast.error("Location not found. Please try a different search term.");
        }
      }
    } catch (error) {
      console.error('[LocationSelectorStep] Search error:', error);
      setState(prev => ({
        ...prev,
        isSearching: false,
        searchResults: [],
        showResults: false,
        error: "Search failed. Please try again or check your connection."
      }));
      toast.error("Search failed. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, searchValue: value, error: null }));
    
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
    
    setState(prev => ({
      ...prev,
      selectedLocation: location,
      searchValue: displayText,
      showResults: false,
      searchResults: [],
      error: null
    }));
    
    toast.success("Location selected!");
  };

  const getCurrentLocation = async () => {
    if (!state.canUseGeolocation) {
      toast.error("Location detection is not available.");
      return;
    }

    console.log('[LocationSelectorStep] Getting current location...');
    
    setState(prev => ({ 
      ...prev, 
      isDetecting: true, 
      error: null,
      permissionDenied: false 
    }));
    
    try {
      const coordinates = await geolocationService.getCurrentPosition();
      
      if (!coordinates) {
        throw new Error("Could not determine your location");
      }
      
      console.log('[LocationSelectorStep] Coordinates obtained, reverse geocoding...');
      
      const locationData = await geolocationService.reverseGeocode(coordinates.lat, coordinates.lng);
      
      if (locationData) {
        console.log('[LocationSelectorStep] Location data obtained:', locationData);
        selectLocation(locationData);
        toast.success("Current location detected!");
      } else {
        console.error('[LocationSelectorStep] Reverse geocoding failed');
        throw new Error("Could not determine location details");
      }
      
    } catch (error: any) {
      console.error('[LocationSelectorStep] Location detection error:', error);
      
      const isPermissionError = error.message.includes('denied') || error.message.includes('permissions');
      
      setState(prev => ({
        ...prev,
        error: error.message,
        permissionDenied: isPermissionError
      }));
      
      toast.error(error.message);
    } finally {
      setState(prev => ({ ...prev, isDetecting: false }));
    }
  };

  const handleSubmit = () => {
    if (!state.selectedLocation) {
      toast.error("Please select a location first.");
      return;
    }
    
    console.log('[LocationSelectorStep] Submitting location:', state.selectedLocation);
    onSubmit(state.selectedLocation);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state.searchResults.length > 0) {
      e.preventDefault();
      selectLocation(state.searchResults[0]);
    }
    if (e.key === 'Escape') {
      setState(prev => ({ ...prev, showResults: false }));
    }
  };

  const retryService = () => {
    console.log('[LocationSelectorStep] Retrying service...');
    geolocationService.resetCircuitBreaker();
    setState(prev => ({ ...prev, error: null }));
    toast.success("Service reset. You can try again now.");
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, showResults: false }));
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

      {/* Location unavailable warning */}
      {!state.canUseGeolocation && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Location detection is not available. Please use the search function to find your location.
          </AlertDescription>
        </Alert>
      )}

      {/* Permission instructions */}
      {state.permissionDenied && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            To use location detection, please enable location permissions in your browser settings and refresh the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Error display */}
      {state.error && !state.permissionDenied && !state.error.includes('HTTPS') && !state.error.includes('secure') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{state.error}</span>
            {!geolocationService.isServiceHealthy() && (
              <Button variant="outline" size="sm" onClick={retryService}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for your city..."
            value={state.searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-10 border border-[rgba(130,122,255,0.41)] rounded-xl"
            disabled={state.isDetecting || state.isSearching}
          />
          {state.isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
          )}
          
          {/* Search Results Dropdown */}
          {state.showResults && state.searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {state.searchResults.map((location, index) => (
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

        {/* Only show location button if geolocation is available */}
        {state.canUseGeolocation && (
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={state.isDetecting || state.isSearching}
            className="w-full"
          >
            {state.isDetecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Detecting Location...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </>
            )}
          </Button>
        )}

        {state.selectedLocation && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">
                  {state.selectedLocation.city}
                  {state.selectedLocation.state && `, ${state.selectedLocation.state}`}, {state.selectedLocation.country}
                </p>
                {state.selectedLocation.coordinates && (
                  <p className="text-sm text-green-600">
                    Lat: {state.selectedLocation.coordinates.lat.toFixed(4)}, 
                    Lng: {state.selectedLocation.coordinates.lng.toFixed(4)}
                  </p>
                )}
                {state.selectedLocation.fullAddress && (
                  <p className="text-xs text-green-500 mt-1 truncate">
                    {state.selectedLocation.fullAddress}
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
          disabled={!state.selectedLocation || state.isDetecting || state.isSearching}
          className="bg-black text-white hover:bg-black/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
