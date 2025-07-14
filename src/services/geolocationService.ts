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

class GeolocationService {
  private readonly BASE_URL = 'https://nominatim.openstreetmap.org';
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_MS = 1000; // 1 second between requests

  private async rateLimitedFetch(url: string): Promise<Response> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_MS) {
      await new Promise(resolve => 
        setTimeout(resolve, this.RATE_LIMIT_MS - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
    
    return fetch(url, {
      headers: {
        'User-Agent': 'TagTeamApp/1.0'
      }
    });
  }

  async reverseGeocode(lat: number, lng: number): Promise<LocationData | null> {
    try {
      const url = `${this.BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const response = await this.rateLimitedFetch(url);
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }
      
      const data: NominatimResult = await response.json();
      
      return this.parseLocationData(data);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  async searchLocation(query: string): Promise<LocationData[]> {
    try {
      const url = `${this.BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
      const response = await this.rateLimitedFetch(url);
      
      if (!response.ok) {
        throw new Error('Location search failed');
      }
      
      const data: NominatimResult[] = await response.json();
      
      return data.map(result => this.parseLocationData(result)).filter(Boolean) as LocationData[];
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  private parseLocationData(result: NominatimResult): LocationData | null {
    if (!result.address) return null;

    const address = result.address;
    const city = address.city || address.town || address.village || '';
    const country = address.country || '';
    const state = address.state || '';

    if (!city || !country) return null;

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

  // Fallback for when Nominatim is unavailable
  getFallbackCities(): LocationData[] {
    return [
      { city: "New York", country: "United States", state: "New York", fullAddress: "New York, NY, USA" },
      { city: "London", country: "United Kingdom", fullAddress: "London, UK" },
      { city: "Paris", country: "France", fullAddress: "Paris, France" },
      { city: "Tokyo", country: "Japan", fullAddress: "Tokyo, Japan" },
      { city: "Sydney", country: "Australia", state: "New South Wales", fullAddress: "Sydney, NSW, Australia" },
      { city: "Toronto", country: "Canada", state: "Ontario", fullAddress: "Toronto, ON, Canada" },
      { city: "Berlin", country: "Germany", fullAddress: "Berlin, Germany" },
      { city: "Mumbai", country: "India", state: "Maharashtra", fullAddress: "Mumbai, Maharashtra, India" },
      { city: "São Paulo", country: "Brazil", state: "São Paulo", fullAddress: "São Paulo, SP, Brazil" },
      { city: "Seoul", country: "South Korea", fullAddress: "Seoul, South Korea" }
    ];
  }
}

export const geolocationService = new GeolocationService();
export type { LocationData };