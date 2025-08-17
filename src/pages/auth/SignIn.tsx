
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SignIn: React.FC = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Detect iOS Safari
    const userAgent = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setEmailLoading(true);
      console.log("Attempting email sign-in...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Email sign in error:", error);
        toast.error(`Failed to sign in: ${error.message}`);
      } else if (data.session) {
        toast.success("Welcome back!");
        // The AuthContext will handle redirection based on onboarding status
      }
    } catch (error: any) {
      console.error("Email sign in error:", error);
      toast.error(`Failed to sign in: ${error.message || "Unknown error"}`);
    } finally {
      setEmailLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (isIOS) {
      toast.error("Google sign-in is not supported on iOS. Please use email/password instead.");
      return;
    }

    try {
      setGoogleLoading(true);
      console.log("Attempting Google sign-in...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        toast.error(`Failed to sign in with Google: ${error.message}`);
      } else {
        console.log("Google sign-in initiated:", data);
        toast.info("Redirecting to Google for authentication...");
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast.error(`Failed to sign in with Google: ${error.message || "Unknown error"}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <img 
            src="/lovable-uploads/dfdd0e96-f205-4b60-95f6-212079ccd7c1.png" 
            alt="TagTeam Logo" 
            className="mx-auto h-12 mb-4 object-contain" 
            loading="eager"
          />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your TagTeam account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email/Password Form */}
            <form onSubmit={signInWithEmail} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(130,122,255,1)] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(130,122,255,1)] focus:border-transparent"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={emailLoading || !email || !password} 
                className="w-full py-3 text-base bg-[rgba(130,122,255,1)] hover:bg-[rgba(130,122,255,0.9)] text-white"
              >
                {emailLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google OAuth - Hidden on iOS */}
            {!isIOS && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={signInWithGoogle}
                disabled={googleLoading} 
                className="w-full flex items-center justify-center gap-2 py-3 border-2 text-base"
              >
                {googleLoading ? "Connecting..." : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            )}

            {/* iOS Notice */}
            {isIOS && (
              <p className="text-sm text-gray-600 text-center">
                📱 For iOS users: Please use email/password authentication for the best experience.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[rgba(130,122,255,1)] font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
