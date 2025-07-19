
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from 'lodash-es';

interface UsernameValidationResult {
  isValid: boolean;
  isChecking: boolean;
  error: string | null;
  suggestions: string[];
}

export const useUsernameValidation = () => {
  const [validationState, setValidationState] = useState<UsernameValidationResult>({
    isValid: false,
    isChecking: false,
    error: null,
    suggestions: []
  });

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Error checking username:', error);
        return false;
      }

      return !data; // true if username is available (no existing record)
    } catch (error) {
      console.error('Username validation error:', error);
      return false;
    }
  };

  const generateUsernameSuggestions = (baseUsername: string): string[] => {
    const suggestions = [];
    const cleanBase = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Add numbers
    for (let i = 1; i <= 3; i++) {
      suggestions.push(`${cleanBase}${i}`);
    }
    
    // Add random suffixes
    const suffixes = ['_user', '_pro', '_dev'];
    suffixes.forEach(suffix => {
      suggestions.push(`${cleanBase}${suffix}`);
    });

    return suggestions.slice(0, 3);
  };

  const debouncedValidate = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setValidationState({
          isValid: false,
          isChecking: false,
          error: 'Username must be at least 3 characters long',
          suggestions: []
        });
        return;
      }

      // Check format
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(username)) {
        setValidationState({
          isValid: false,
          isChecking: false,
          error: 'Username can only contain letters, numbers, underscores, and hyphens',
          suggestions: []
        });
        return;
      }

      setValidationState(prev => ({ ...prev, isChecking: true }));

      const isAvailable = await checkUsernameAvailability(username);
      
      if (isAvailable) {
        setValidationState({
          isValid: true,
          isChecking: false,
          error: null,
          suggestions: []
        });
      } else {
        const suggestions = generateUsernameSuggestions(username);
        setValidationState({
          isValid: false,
          isChecking: false,
          error: 'This username is already taken',
          suggestions
        });
      }
    }, 500),
    []
  );

  const validateUsername = useCallback((username: string) => {
    debouncedValidate(username);
  }, [debouncedValidate]);

  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: false,
      isChecking: false,
      error: null,
      suggestions: []
    });
  }, []);

  return {
    ...validationState,
    validateUsername,
    resetValidation
  };
};
