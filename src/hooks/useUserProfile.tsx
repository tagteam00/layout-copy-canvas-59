
import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  fullName: string;
  interests: string[];
  id: string;
}

export const useUserProfile = () => {
  const { getUserData } = useUserData();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    interests: [],
    id: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          const { data: authData } = await supabase.auth.getUser();
          
          setUserProfile({
            fullName: userData.fullName,
            interests: userData.interests || [],
            id: authData.user?.id || ""
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  return { userProfile, loading };
};
