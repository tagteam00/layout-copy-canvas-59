
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    getValues
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // User is already signed in, redirect to home or onboarding
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .maybeSingle();
          
        navigate(profileData ? "/home" : "/onboarding");
      }
    };
    
    checkSession();
  }, [navigate]);

  const onSubmit = async data => {
    try {
      setLoading(true);
      
      console.log("Attempting sign in with:", data.email);

      // Sign in with Supabase
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        
        if (error.message.includes('not confirmed')) {
          // If email not confirmed, offer to send a magic link
          toast.error("Email not confirmed. Try using the magic link option below.");
          return;
        }
        
        if (error.message.includes('Invalid login')) {
          toast.error("Invalid email or password. Please check your credentials.");
          return;
        }
        
        toast.error(error.message || "Failed to sign in. Please try again.");
        return;
      }
      
      if (signInData?.user) {
        toast.success("Signed in successfully!");
        console.log("Sign in successful:", signInData);
        
        // Check if user has completed onboarding
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .maybeSingle();
          
        // Redirect to appropriate page based on onboarding status
        navigate(profileData ? "/home" : "/onboarding");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      console.log("Attempting Google sign-in...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
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

  const sendMagicLink = async () => {
    const email = getValues("email");
    
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    try {
      setSendingMagicLink(true);
      
      // Attempt to send a magic link login
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        if (error.status === 429) {
          toast.error("Too many login attempts. Please try again later.");
        } else {
          toast.error(error.message || "Failed to send magic link");
        }
      } else {
        toast.success("Magic link sent! Check your email inbox.");
      }
    } catch (error) {
      console.error("Magic link error:", error);
      toast.error("Failed to send magic link. Please try again later.");
    } finally {
      setSendingMagicLink(false);
    }
  };

  return <div className="min-h-screen flex items-center justify-center bg-white p-4">
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
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={signInWithGoogle}
                disabled={googleLoading} 
                className="w-full flex items-center justify-center gap-2 py-5 border-2"
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
                    Sign in with Google
                  </>
                )}
              </Button>
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
                OR
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input id="email" type="email" placeholder="Your email" {...register("email", {
                required: "Email is required"
              })} className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <Input id="password" type="password" placeholder="Your password" {...register("password", {
                required: "Password is required"
              })} className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-black/90" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center mt-2">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={sendMagicLink} 
                  disabled={sendingMagicLink} 
                  className="text-[rgba(130,122,255,1)] text-sm px-0"
                >
                  {sendingMagicLink ? "Sending..." : "Send me a magic link instead"}
                </Button>
              </div>
            </form>
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
    </div>;
};

export default SignIn;
