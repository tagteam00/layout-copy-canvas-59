
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

interface LocationData {
  city: string;
  country: string;
  coordinates: [number, number];
  fullAddress: string;
}

interface MapLocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  onBack: () => void;
  initialLocation?: LocationData;
}

export const MapLocationSelector: React.FC<MapLocationSelectorProps> = ({
  onLocationSelect,
  onBack,
  initialLocation
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const geocoder = useRef<MapboxGeocoder | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(initialLocation || null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // For now, we'll use a temporary input for the Mapbox token
  // In production, this should be stored in Supabase secrets
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialLocation?.coordinates || [-74.5, 40],
      zoom: initialLocation ? 10 : 2
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Initialize geocoder
    geocoder.current = new MapboxGeocoder({
      accessToken: mapboxToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: 'Search for your location...'
    });

    // Add geocoder to map
    map.current.addControl(geocoder.current);

    // Handle geocoder result
    geocoder.current.on('result', (e) => {
      const result = e.result;
      const coordinates: [number, number] = [result.center[0], result.center[1]];
      
      const locationData: LocationData = {
        city: extractCity(result),
        country: extractCountry(result),
        coordinates,
        fullAddress: result.place_name
      };

      setSelectedLocation(locationData);
      updateMarker(coordinates);
    });

    // Handle map click
    map.current.on('click', async (e) => {
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxToken}`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const result = data.features[0];
          const locationData: LocationData = {
            city: extractCity(result),
            country: extractCountry(result),
            coordinates,
            fullAddress: result.place_name
          };

          setSelectedLocation(locationData);
          updateMarker(coordinates);
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    });

    // Add initial marker if location is provided
    if (initialLocation) {
      updateMarker(initialLocation.coordinates);
    }

    map.current.on('load', () => {
      setIsLoading(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, initialLocation]);

  const updateMarker = (coordinates: [number, number]) => {
    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map.current!);

    map.current!.easeTo({
      center: coordinates,
      zoom: 10
    });
  };

  const extractCity = (result: any): string => {
    // Try to find city in different contexts
    const contexts = result.context || [];
    for (const context of contexts) {
      if (context.id.startsWith('place.')) {
        return context.text;
      }
    }
    
    // Fallback to place name or text
    if (result.place_type && result.place_type.includes('place')) {
      return result.text;
    }
    
    return result.text || 'Unknown City';
  };

  const extractCountry = (result: any): string => {
    const contexts = result.context || [];
    for (const context of contexts) {
      if (context.id.startsWith('country.')) {
        return context.text;
      }
    }
    return 'Unknown Country';
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates: [number, number] = [
          position.coords.longitude,
          position.coords.latitude
        ];

        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxToken}`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const result = data.features[0];
            const locationData: LocationData = {
              city: extractCity(result),
              country: extractCountry(result),
              coordinates,
              fullAddress: result.place_name
            };

            setSelectedLocation(locationData);
            updateMarker(coordinates);
          }
        } catch (error) {
          console.error('Error getting current location:', error);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
        alert('Unable to retrieve your location. Please search manually.');
      }
    );
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  if (!mapboxToken) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">Select Your Location</h2>
        <p className="text-sm text-gray-600 mb-4">
          To use the map location selector, please enter your Mapbox public token. 
          You can get one for free at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mapbox.com</a>
        </p>
        <div>
          <label htmlFor="mapbox-token" className="block text-sm font-medium mb-1">
            Mapbox Public Token
          </label>
          <Input
            id="mapbox-token"
            type="password"
            placeholder="pk.eyJ1Ijoi..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
          />
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={() => setMapboxToken(tokenInput)}
            disabled={!tokenInput.trim()}
            className="bg-black text-white hover:bg-black/90"
          >
            Continue with Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Select Your Location</h2>
      
      {/* Current Location Button */}
      <Button
        onClick={getCurrentLocation}
        disabled={isGettingLocation}
        variant="outline"
        className="w-full"
      >
        {isGettingLocation ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <MapPin className="w-4 h-4 mr-2" />
        )}
        Use Current Location
      </Button>

      {/* Map Container */}
      <div className="relative h-64 rounded-lg overflow-hidden border">
        <div ref={mapContainer} className="w-full h-full" />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-sm mb-1">Selected Location:</h3>
          <p className="text-sm text-gray-700">{selectedLocation.fullAddress}</p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedLocation.city}, {selectedLocation.country}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Click on the map or use the search box above the map to select your location.
      </p>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className="bg-black text-white hover:bg-black/90"
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
};
