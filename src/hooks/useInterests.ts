
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Interest {
  id: string;
  name: string;
  category: 'fitness' | 'arts';
}

export const useInterests = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const { data, error } = await supabase
          .from('interests')
          .select('*')
          .order('name');

        if (error) throw error;
        setInterests(data);
      } catch (err) {
        console.error('Error fetching interests:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch interests');
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  return { interests, loading, error };
};
