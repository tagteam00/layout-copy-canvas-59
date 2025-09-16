
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);

        // Process the authentication response
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          toast.error(`Authentication failed: ${error.message}`);
          setTimeout(() => navigate('/signin'), 2000);
          return;
        }
        
        if (data.session) {
          // Check if user has completed onboarding
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error checking profile during callback:", profileError);
            toast.error("Unable to verify profile. Please try signing in again.");
            navigate('/signin');
            return;
          }
            
          // Redirect based on onboarding status
          if (profileData) {
            console.log("User has profile, redirecting to home");
            toast.success("Authentication successful!");
            navigate('/home');
          } else {
            console.log("User has account but no profile - directing to onboarding");
            toast.success("Welcome back! Let's complete your profile setup.");
            navigate('/onboarding');
          }
        } else {
          // If no session, redirect to signin
          console.log("No session found, redirecting to signin");
          setError("No session found. Please try signing in again.");
          navigate('/signin');
        }
      } catch (err: any) {
        console.error("Error in auth callback:", err);
        setError(err.message || "Authentication failed");
        toast.error("Authentication failed. Please try again.");
        navigate('/signin');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8">
        {error ? (
          <div>
            <h1 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-gray-500">Redirecting you back to sign in...</p>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold mb-4">Completing your authentication...</h1>
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Please wait while we redirect you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
