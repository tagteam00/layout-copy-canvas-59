
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  user: any;
  session: any;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  authError: string | null;
  updateOnboardingStatus?: (status: boolean) => Promise<void>;
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Clear corrupted auth cache
  const clearAuthCache = async () => {
    try {
      // Clear browser storage
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-tvguxgtpflhubonpxovd-auth-token');
      sessionStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('sb-tvguxgtpflhubonpxovd-auth-token');
      
      // Sign out to clear any server-side session
      await supabase.auth.signOut();
      
      console.log("Auth cache cleared");
    } catch (error) {
      console.error("Error clearing auth cache:", error);
    }
  };

  // Function to safely check profile completion
  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking profile:", error);
        return false;
      }
      
      return !!data;
    } catch (err) {
      console.error("Error in profile check:", err);
      return false;
    }
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    let authListener: { subscription: { unsubscribe: () => void } };
    
    // Clear any corrupted auth cache on app load
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error && (error.message.includes('Invalid') || error.message.includes('expired'))) {
          console.log("Detected corrupted session, clearing cache");
          await clearAuthCache();
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        await clearAuthCache();
      }
    };
    
    const setupAuthListener = () => {
      // Set up the auth state listener
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log("Auth state changed:", event, !!currentSession);
          
          // Update session and user synchronously
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          // Defer profile check to prevent auth deadlocks
          if (currentSession?.user) {
            setTimeout(async () => {
              const hasProfile = await checkProfileCompletion(currentSession.user.id);
              setHasCompletedOnboarding(hasProfile);
            }, 0);
          } else {
            setHasCompletedOnboarding(false);
          }

          // Set loading to false after auth state has been processed
          setLoading(false);
        }
      );
      
      authListener = listener;
    };

    const checkExistingSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          // If refresh token is invalid, clear it and sign out
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('refresh_token_not_found')) {
            console.log("Invalid refresh token detected, clearing session");
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setHasCompletedOnboarding(false);
          }
          setAuthError(error.message);
          setLoading(false);
          return;
        }
        
        console.log("Session check result:", !!data.session);
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Check if user has completed onboarding
        if (data.session?.user) {
          const hasProfile = await checkProfileCompletion(data.session.user.id);
          setHasCompletedOnboarding(hasProfile);
        }
        
      } catch (error: any) {
        console.error("Error checking auth status:", error);
        setAuthError(error.message);
      } finally {
        // Ensure loading is set to false even if there's an error
        setLoading(false);
        setIsInitialized(true);
      }
    };

    // Initialize auth, set up listener, then check for existing session
    initializeAuth().then(() => {
      setupAuthListener();
      checkExistingSession();
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
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
      authError,
      updateOnboardingStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
