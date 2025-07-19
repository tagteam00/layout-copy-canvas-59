
import { useState, useEffect } from 'react';

interface GeolocationDebugInfo {
  isSupported: boolean;
  permission: PermissionState | 'unknown';
  isHttps: boolean;
  userAgent: string;
  coordinates: { lat: number; lng: number } | null;
  error: string | null;
}

export const useGeolocationDebug = () => {
  const [debugInfo, setDebugInfo] = useState<GeolocationDebugInfo>({
    isSupported: false,
    permission: 'unknown',
    isHttps: false,
    userAgent: '',
    coordinates: null,
    error: null
  });

  useEffect(() => {
    const checkGeolocationCapabilities = async () => {
      const info: GeolocationDebugInfo = {
        isSupported: 'geolocation' in navigator,
        permission: 'unknown',
        isHttps: window.location.protocol === 'https:',
        userAgent: navigator.userAgent,
        coordinates: null,
        error: null
      };

      // Check permissions if supported
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          info.permission = permission.state;
        } catch (error) {
          console.warn('Could not check geolocation permissions:', error);
        }
      }

      setDebugInfo(info);
      
      // Log debug information
      console.log('[GeolocationDebug] Browser capabilities:', {
        supported: info.isSupported,
        permission: info.permission,
        https: info.isHttps,
        userAgent: info.userAgent.substring(0, 50) + '...'
      });
    };

    checkGeolocationCapabilities();
  }, []);

  const testGeolocation = async (): Promise<void> => {
    if (!debugInfo.isSupported) {
      setDebugInfo(prev => ({ 
        ...prev, 
        error: 'Geolocation not supported' 
      }));
      return;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setDebugInfo(prev => ({
            ...prev,
            coordinates: coords,
            error: null
          }));
          
          console.log('[GeolocationDebug] Test successful:', coords);
          resolve();
        },
        (error) => {
          const errorMessage = `Error ${error.code}: ${error.message}`;
          setDebugInfo(prev => ({
            ...prev,
            error: errorMessage,
            coordinates: null
          }));
          
          console.error('[GeolocationDebug] Test failed:', errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  };

  return {
    debugInfo,
    testGeolocation
  };
};
