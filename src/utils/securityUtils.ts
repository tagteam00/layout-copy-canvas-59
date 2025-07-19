
/**
 * Security utilities for checking browser security context
 */

export interface SecurityContext {
  isHttps: boolean;
  isSecureContext: boolean;
  isLocalhost: boolean;
  isDevelopment: boolean;
  canUseGeolocation: boolean;
}

export const getSecurityContext = (): SecurityContext => {
  const isHttps = window.location.protocol === 'https:';
  const isSecureContext = window.isSecureContext || false;
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.endsWith('.local');
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Geolocation requires secure context (HTTPS or localhost)
  const canUseGeolocation = isSecureContext || isLocalhost;
  
  console.log('[SecurityUtils] Security context:', {
    isHttps,
    isSecureContext,
    isLocalhost,
    isDevelopment,
    canUseGeolocation,
    hostname: window.location.hostname,
    protocol: window.location.protocol
  });
  
  return {
    isHttps,
    isSecureContext,
    isLocalhost,
    isDevelopment,
    canUseGeolocation
  };
};

export const getGeolocationErrorMessage = (securityContext: SecurityContext): string => {
  if (!securityContext.canUseGeolocation) {
    if (securityContext.isDevelopment) {
      return "Location detection requires HTTPS or localhost. For development, try accessing via localhost or enable HTTPS.";
    } else {
      return "Location detection is only available on secure (HTTPS) connections. Please use the search function instead.";
    }
  }
  return "Location detection is not available in your browser.";
};
