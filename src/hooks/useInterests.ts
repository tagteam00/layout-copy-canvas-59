
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Interest {
  id: string;
  name: string;
  category: string;
}

interface UseInterestsReturn {
  interests: Interest[];
  loading: boolean;
  error: string | null;
  retry: () => void;
  isRetrying: boolean;
}

export const useInterests = (): UseInterestsReturn => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { session, loading: authLoading } = useAuth();

  // Network connectivity check
  const isOnline = navigator.onLine;

  const fetchInterests = useCallback(async (isRetryAttempt = false) => {
    // Wait for auth to be initialized before making requests
    if (authLoading) {
      console.log('useInterests: Waiting for auth to initialize...');
      return;
    }

    // Check network connectivity
    if (!isOnline) {
      console.error('useInterests: No network connection');
      setError('No internet connection. Please check your network and try again.');
      setLoading(false);
      return;
    }

    if (isRetryAttempt) {
      setIsRetrying(true);
      setError(null);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      console.log('useInterests: Fetching interests...');
      
      const { data, error: supabaseError } = await supabase
        .from('interests')
        .select('*')
        .order('name');

      if (supabaseError) {
        console.error('useInterests: Supabase error:', supabaseError);
        throw new Error(`Database error: ${supabaseError.message}`);
      }

      if (!data) {
        throw new Error('No data received from server');
      }

      console.log(`useInterests: Successfully fetched ${data.length} interests`);
      setInterests(data);
      setError(null);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('useInterests: Error fetching interests:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch interests';
      
      // Implement exponential backoff for retries
      if (retryCount < 3 && !isRetryAttempt) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`useInterests: Auto-retry in ${delay}ms (attempt ${retryCount + 1}/3)`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchInterests(true);
        }, delay);
        
        setError(`Connection error. Retrying in ${delay / 1000}s... (${retryCount + 1}/3)`);
      } else {
        setError(`${errorMessage}. Please try again.`);
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [authLoading, isOnline, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(0);
    fetchInterests(true);
  }, [fetchInterests]);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('useInterests: Network connection restored');
      if (error && error.includes('network')) {
        retry();
      }
    };

    const handleOffline = () => {
      console.log('useInterests: Network connection lost');
      setError('No internet connection. Please check your network and try again.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, retry]);

  return { interests, loading, error, retry, isRetrying };
};
