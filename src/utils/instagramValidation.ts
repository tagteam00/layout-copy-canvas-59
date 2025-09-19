// Instagram URL validation utility to match database constraints exactly

export const validateInstagramUrl = (url: string): boolean => {
  if (!url || url === '') return true; // Empty is allowed
  
  // Match exact database validation rules
  return (
    url.length <= 500 &&
    /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//.test(url)
  );
};

export const getInstagramUrlValidationError = (url: string): string | null => {
  if (!url || url === '') return null;
  
  if (url.length > 500) {
    return 'Instagram URL must be 500 characters or less';
  }
  
  if (!/^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//.test(url)) {
    return 'Please enter a valid Instagram URL (e.g., https://instagram.com/username)';
  }
  
  return null;
};

export const extractUsernameFromUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Extract username from Instagram URL
    const match = url.match(/instagram\.com\/([^\/\?]+)/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
};