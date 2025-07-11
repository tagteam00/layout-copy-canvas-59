import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationData {
  city: string;
  state?: string;
  country: string;
  coordinates: { lat: number; lng: number };
  fullAddress: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng } = await req.json();
    
    if (!lat || !lng) {
      throw new Error('Latitude and longitude are required');
    }

    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!googleMapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    // Call Google Geocoding API for reverse geocoding
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`;
    
    console.log(`Making reverse geocoding request for coordinates: ${lat}, ${lng}`);
    
    const response = await fetch(geocodeUrl);
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`Geocoding failed: ${data.status || 'No results found'}`);
    }

    const result = data.results[0];
    const addressComponents = result.address_components;
    
    let city = '';
    let state = '';
    let country = '';

    // Parse address components to extract city, state, and country
    for (const component of addressComponents) {
      const types = component.types;
      
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      }
      
      // Fallback for cities
      if (!city && types.includes('sublocality')) {
        city = component.long_name;
      }
    }

    // Create formatted address
    let formattedAddress = '';
    if (city && state && country) {
      formattedAddress = `${city}, ${state}, ${country}`;
    } else if (city && country) {
      formattedAddress = `${city}, ${country}`;
    } else {
      formattedAddress = result.formatted_address;
    }

    const locationData: LocationData = {
      city: city || 'Unknown City',
      state: state || undefined,
      country: country || 'Unknown Country',
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      fullAddress: formattedAddress
    };

    console.log('Successfully reverse geocoded:', locationData);

    return new Response(JSON.stringify(locationData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in reverse-geocode function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});