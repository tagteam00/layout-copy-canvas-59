
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        
        // Check if profile exists to determine onboarding status
        if (currentSession?.user) {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .maybeSingle();
            
            if (error) {
              console.error("Error checking profile:", error);
            }
            
            // Set onboarding status based on profile existence
            setHasCompletedOnboarding(!!data);
            console.log("Onboarding status:", !!data);
          } catch (err) {
            console.error("Error in profile check:", err);
          }
        } else {
          setHasCompletedOnboarding(false);
        }
      }
    );

    // Then check for existing session
    const checkUser = async () => {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
        }
        
        console.log("Session check result:", !!data.session);
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Check if user has completed onboarding
        if (data.session?.user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error("Error fetching profile:", profileError);
            }
            
            // Update onboarding status based on profile existence
            const onboardingComplete = !!profileData;
            setHasCompletedOnboarding(onboardingComplete);
            console.log("Initial onboarding status:", onboardingComplete);
          } catch (err) {
            console.error("Error in profile fetch:", err);
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
