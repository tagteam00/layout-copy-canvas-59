
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  user: any;
  session: any;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  updateOnboardingStatus?: (status: boolean) => Promise<void>;
  authError?: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  hasCompletedOnboarding: false,
  authError: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthProvider: Initializing");
    let authTimeout: NodeJS.Timeout;

    // Safety timeout to prevent infinite loading state
    authTimeout = setTimeout(() => {
      if (loading) {
        console.warn("AuthProvider: Force completing auth check after timeout");
        setLoading(false);
        setAuthError("Authentication check timed out. Please refresh the page.");
      }
    }, 10000); // 10 second timeout for auth
    
    // Set up the auth state listener first to avoid missing auth events
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("AuthProvider: Auth state changed:", event, !!currentSession);
        
        try {
          // Update session and user synchronously
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          // Defer profile check to prevent auth deadlocks
          if (currentSession?.user) {
            setTimeout(async () => {
              try {
                const { data, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', currentSession.user.id)
                  .maybeSingle();
                
                if (error) {
                  console.error("AuthProvider: Error checking profile:", error);
                  setAuthError("Error checking profile status.");
                }
                
                setHasCompletedOnboarding(!!data);
              } catch (err) {
                console.error("AuthProvider: Error in profile check:", err);
                setAuthError("Error verifying profile information.");
              }
            }, 0);
          } else {
            setHasCompletedOnboarding(false);
          }
        } catch (error) {
          console.error("AuthProvider: Error in auth state change handler:", error);
          setAuthError("Error processing authentication state.");
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const checkUser = async () => {
      try {
        console.log("AuthProvider: Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider: Session check error:", error);
          setAuthError("Error retrieving authentication session.");
          setLoading(false);
          return;
        }
        
        console.log("AuthProvider: Session check result:", !!data.session);
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
              console.error("AuthProvider: Error fetching profile:", profileError);
              setAuthError("Error fetching profile information.");
            }
            
            setHasCompletedOnboarding(!!profileData);
          } catch (err) {
            console.error("AuthProvider: Error in profile fetch:", err);
            setAuthError("Error retrieving profile data.");
          }
        }
      } catch (error) {
        console.error("AuthProvider: Error checking auth status:", error);
        setAuthError("Error checking authentication status.");
      } finally {
        setLoading(false);
        console.log("AuthProvider: Auth check completed");
      }
    };
    
    // Check user with a small delay to ensure listeners are set up first
    setTimeout(checkUser, 100);

    return () => {
      clearTimeout(authTimeout);
      authListener.subscription.unsubscribe();
      console.log("AuthProvider: Cleanup complete");
    };
  }, []);

  // Function to update the onboarding status
  const updateOnboardingStatus = async (status: boolean) => {
    setHasCompletedOnboarding(status);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      hasCompletedOnboarding,
      updateOnboardingStatus,
      authError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
