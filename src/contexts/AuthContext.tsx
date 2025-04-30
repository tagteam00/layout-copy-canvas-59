
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserData } from "@/hooks/useUserData";

type AuthContextType = {
  user: any;
  session: any;
  loading: boolean;
  hasCompletedOnboarding: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  hasCompletedOnboarding: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    // Set up the auth state listener first to avoid missing auth events
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        
        // Update session and user synchronously
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Check profile data
        if (currentSession?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          console.log("Profile data for user:", data);
          setHasCompletedOnboarding(!!data);
        } else {
          setHasCompletedOnboarding(false);
        }
      }
    );

    // Then check for existing session
    const checkUser = async () => {
      try {
        console.log("Checking for existing session");
        const { data } = await supabase.auth.getSession();
        console.log("Session check result:", !!data.session);
        
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Check if user has completed onboarding
        if (data.session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          console.log("Profile data from initial check:", profileData);
          setHasCompletedOnboarding(!!profileData);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, hasCompletedOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};
