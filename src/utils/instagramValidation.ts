// Instagram handle validation utility to match database constraints exactly

export const validateInstagramHandle = (handle: string): boolean => {
  if (!handle || handle === '') return true; // Empty is allowed
  
  // Match exact database validation rules
  return (
    handle.length <= 30 &&
    /^[a-zA-Z0-9._]+$/.test(handle) &&
    !handle.startsWith('.') &&
    !handle.endsWith('.') &&
    !handle.includes('..')
  );
};

export const getInstagramValidationError = (handle: string): string | null => {
  if (!handle || handle === '') return null;
  
  if (handle.length > 30) {
    return 'Instagram handle must be 30 characters or less';
  }
  
  if (!/^[a-zA-Z0-9._]+$/.test(handle)) {
    return 'Instagram handle can only contain letters, numbers, periods, and underscores';
  }
  
  if (handle.startsWith('.') || handle.endsWith('.')) {
    return 'Instagram handle cannot start or end with a period';
  }
  
  if (handle.includes('..')) {
    return 'Instagram handle cannot contain consecutive periods';
  }
  
  return null;
};