import { getSecurityContext, getGeolocationErrorMessage } from '@/utils/securityUtils';

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

interface LocationData {
  city: string;
  country: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  fullAddress?: string;
}

interface GeolocationError {
  code: number;
  message: string;
  isPermissionDenied: boolean;
  isPositionUnavailable: boolean;
  isTimeout: boolean;
}

class GeolocationService {
  private readonly BASE_URL = 'https://nominatim.openstreetmap.org';
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_MS = 1000;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 2000;
  private failureCount = 0;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private securityContext = getSecurityContext();

  constructor() {
    // Update security context on initialization
    this.securityContext = getSecurityContext();
  }

  // Check if geolocation is available and secure
  canUseGeolocation(): boolean {
    return this.securityContext.canUseGeolocation && 'geolocation' in navigator;
  }

  // Get appropriate error message for geolocation unavailability
  getGeolocationUnavailableMessage(): string {
    if (!('geolocation' in navigator)) {
      return "Your browser doesn't support location detection.";
    }
    return getGeolocationErrorMessage(this.securityContext);
  }

  // Enhanced rate limiting with exponential backoff
  private async rateLimitedFetch(url: string, retryCount = 0): Promise<Response> {
    console.log(`[GeolocationService] Making API request (attempt ${retryCount + 1}):`, url);
    
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_MS) {
      const waitTime = this.RATE_LIMIT_MS - timeSinceLastRequest;
      console.log(`[GeolocationService] Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TagTeamApp/1.0'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      console.log(`[GeolocationService] API response:`, response.status, response.statusText);
      
      if (!response.ok) {
        this.failureCount++;
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
          console.warn(`[GeolocationService] Rate limited. Retry after ${retryAfter} seconds`);
          
          if (retryCount < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return this.rateLimitedFetch(url, retryCount + 1);
          }
        }
        
        if (response.status >= 500 && retryCount < this.MAX_RETRIES) {
          const delay = this.RETRY_DELAY_MS * Math.pow(2, retryCount);
          console.warn(`[GeolocationService] Server error ${response.status}. Retrying in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.rateLimitedFetch(url, retryCount + 1);
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      this.failureCount = 0;
      return response;
      
    } catch (error) {
      this.failureCount++;
      console.error(`[GeolocationService] Fetch error (attempt ${retryCount + 1}):`, error);
      
      if (this.failureCount >= this.CIRCUIT_BREAKER_THRESHOLD) {
        console.error(`[GeolocationService] Circuit breaker activated after ${this.failureCount} failures`);
        throw new Error('Service temporarily unavailable due to repeated failures');
      }
      
      if (retryCount < this.MAX_RETRIES && (error instanceof TypeError || error.name === 'NetworkError')) {
        const delay = this.RETRY_DELAY_MS * Math.pow(2, retryCount);
        console.warn(`[GeolocationService] Network error. Retrying in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.rateLimitedFetch(url, retryCount + 1);
      }
      
      throw error;
    }
  }

  // Enhanced geolocation with security context checking
  async getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
    console.log('[GeolocationService] Starting getCurrentPosition');
    
    // Check security context first
    if (!this.canUseGeolocation()) {
      const errorMessage = this.getGeolocationUnavailableMessage();
      console.error('[GeolocationService] Geolocation blocked due to security context:', errorMessage);
      throw new Error(errorMessage);
    }

    // Check permissions first
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        console.log('[GeolocationService] Geolocation permission status:', permission.state);
        
        if (permission.state === 'denied') {
          throw new Error('Location access has been denied. Please enable location permissions in your browser settings.');
        }
      }
    } catch (permissionError) {
      console.warn('[GeolocationService] Could not check permissions:', permissionError);
    }

    return new Promise((resolve, reject) => {
      console.log('[GeolocationService] Requesting current position...');
      
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('[GeolocationService] Position obtained:', { 
            lat: latitude, 
            lng: longitude,
            accuracy: position.coords.accuracy 
          });
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('[GeolocationService] Geolocation error:', error);
          
          let userFriendlyMessage = 'Unable to retrieve your location. ';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              userFriendlyMessage += 'Location access was denied. Please enable location permissions in your browser settings and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              userFriendlyMessage += 'Location information is unavailable. Please check your internet connection or try searching manually.';
              break;
            case error.TIMEOUT:
              userFriendlyMessage += 'Location request timed out. Please try again or search manually.';
              break;
            default:
              userFriendlyMessage += 'Please try again or search manually.';
          }
          
          reject(new Error(userFriendlyMessage));
        },
        options
      );
    });
  }

  async reverseGeocode(lat: number, lng: number): Promise<LocationData | null> {
    try {
      console.log(`[GeolocationService] Starting reverse geocode for:`, { lat, lng });
      
      const url = `${this.BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const response = await this.rateLimitedFetch(url);
      
      const data: NominatimResult = await response.json();
      console.log('[GeolocationService] Reverse geocoding data:', data);
      
      const locationData = this.parseLocationData(data);
      console.log('[GeolocationService] Parsed location data:', locationData);
      
      return locationData;
    } catch (error) {
      console.error('[GeolocationService] Reverse geocoding error:', error);
      return null;
    }
  }

  async searchLocation(query: string): Promise<LocationData[]> {
    try {
      console.log(`[GeolocationService] Searching for location:`, query);
      
      const url = `${this.BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
      const response = await this.rateLimitedFetch(url);
      
      const data: NominatimResult[] = await response.json();
      console.log(`[GeolocationService] Search results:`, data);
      
      const results = data.map(result => this.parseLocationData(result)).filter(Boolean) as LocationData[];
      console.log(`[GeolocationService] Parsed search results:`, results);
      
      return results;
    } catch (error) {
      console.error('[GeolocationService] Location search error:', error);
      return [];
    }
  }

  private parseLocationData(result: NominatimResult): LocationData | null {
    if (!result.address) {
      console.warn('[GeolocationService] No address data in result:', result);
      return null;
    }

    const address = result.address;
    const city = address.city || address.town || address.village || '';
    const country = address.country || '';
    const state = address.state || '';

    if (!city || !country) {
      console.warn('[GeolocationService] Incomplete address data:', { city, country, state });
      return null;
    }

    return {
      city,
      country,
      state,
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      },
      fullAddress: result.display_name
    };
  }

  getFallbackCities(): LocationData[] {
    return [
      { city: "New York", country: "United States", state: "New York", fullAddress: "New York, NY, USA" },
      { city: "Los Angeles", country: "United States", state: "California", fullAddress: "Los Angeles, CA, USA" },
      { city: "Chicago", country: "United States", state: "Illinois", fullAddress: "Chicago, IL, USA" },
      { city: "London", country: "United Kingdom", fullAddress: "London, UK" },
      { city: "Paris", country: "France", fullAddress: "Paris, France" },
      { city: "Berlin", country: "Germany", fullAddress: "Berlin, Germany" },
      { city: "Tokyo", country: "Japan", fullAddress: "Tokyo, Japan" },
      { city: "Seoul", country: "South Korea", fullAddress: "Seoul, South Korea" },
      { city: "Sydney", country: "Australia", state: "New South Wales", fullAddress: "Sydney, NSW, Australia" },
      { city: "Melbourne", country: "Australia", state: "Victoria", fullAddress: "Melbourne, VIC, Australia" },
      { city: "Toronto", country: "Canada", state: "Ontario", fullAddress: "Toronto, ON, Canada" },
      { city: "Vancouver", country: "Canada", state: "British Columbia", fullAddress: "Vancouver, BC, Canada" },
      { city: "Mumbai", country: "India", state: "Maharashtra", fullAddress: "Mumbai, Maharashtra, India" },
      { city: "Delhi", country: "India", fullAddress: "Delhi, India" },
      { city: "São Paulo", country: "Brazil", state: "São Paulo", fullAddress: "São Paulo, SP, Brazil" },
      { city: "Rio de Janeiro", country: "Brazil", state: "Rio de Janeiro", fullAddress: "Rio de Janeiro, RJ, Brazil" },
      { city: "Mexico City", country: "Mexico", fullAddress: "Mexico City, Mexico" },
      { city: "Singapore", country: "Singapore", fullAddress: "Singapore" },
      { city: "Hong Kong", country: "Hong Kong", fullAddress: "Hong Kong" },
      { city: "Dubai", country: "United Arab Emirates", fullAddress: "Dubai, UAE" }
    ];
  }

  isServiceHealthy(): boolean {
    return this.failureCount < this.CIRCUIT_BREAKER_THRESHOLD;
  }

  resetCircuitBreaker(): void {
    console.log('[GeolocationService] Resetting circuit breaker');
    this.failureCount = 0;
  }
}

export const geolocationService = new GeolocationService();
export type { LocationData, GeolocationError };
