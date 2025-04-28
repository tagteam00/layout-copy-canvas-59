
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
    // Set up the auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Defer profile check to prevent auth deadlocks
        if (currentSession?.user) {
          setTimeout(async () => {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .maybeSingle();
              
              setHasCompletedOnboarding(!!data);
              console.log("Onboarding status:", !!data);
            } catch (error) {
              console.error("Error checking profile:", error);
            }
          }, 0);
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
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Check if user has completed onboarding
        if (data.session?.user) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .maybeSingle();
              
            setHasCompletedOnboarding(!!profileData);
            console.log("User has profile:", !!profileData);
          } catch (profileError) {
            console.error("Error checking profile:", profileError);
          }
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
