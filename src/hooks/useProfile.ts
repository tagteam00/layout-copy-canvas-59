
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useUserData, UserData } from "@/hooks/useUserData";
import { toast } from "sonner";

export const useProfile = () => {
  const { user } = useAuth();
  const { getUserData } = useUserData();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<UserData | null> => {
      try {
        const data = await getUserData();
        if (!data) {
          throw new Error('Profile not found');
        }
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};
