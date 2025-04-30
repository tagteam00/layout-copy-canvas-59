
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    watch
  } = useForm();
  const [loading, setLoading] = useState(false);
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

  // Watch password to use in validation
  const watchPassword = watch("password", "");

  const onSubmit = async data => {
    try {
      setLoading(true);
      console.log("Attempting to sign up with email:", data.email);

      // Try to sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            email: data.email,
          },
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (signUpError) {
        // Handle sign up errors
        console.error("Sign up error:", signUpError);
        if (signUpError.message.includes('User already registered')) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(signUpError.message || "Failed to create account");
        }
        return;
      }
      
      console.log("Sign up response:", authData);
      
      // Immediately try to sign in after signup
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (signInError) {
        console.error("Sign in error after signup:", signInError);
        
        // If there's an error with direct sign-in, try a passwordless link
        if (signInError.message.includes('not confirmed')) {
          try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
              email: data.email,
              options: {
                emailRedirectTo: window.location.origin,
              }
            });
            
            if (otpError) {
              if (otpError.status === 429) {
                toast.info("Too many requests. Please wait a moment and try signing in later.");
              } else {
                toast.error(otpError.message || "Failed to send login link");
              }
            } else {
              toast.success("Account created! Please check your email to verify and log in.");
            }
          } catch (e) {
            console.error("OTP error:", e);
            toast.error("Could not send verification email. Please try signing in later.");
          }
        } else {
          toast.error(signInError.message || "Account created but couldn't sign in automatically. Please try signing in manually.");
        }
        
        // Redirect to sign in page after a successful signup but failed sign in
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
        
        return;
      }
      
      if (signInData?.user) {
        toast.success("Signed up and logged in successfully!");
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Signup/signin process error:", error);
      toast.error("Failed to create account. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  return <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md py-0 my-0">
        <div className="mb-6 text-center">
          <img src="/lovable-uploads/dfdd0e96-f205-4b60-95f6-212079ccd7c1.png" alt="TagTeam Logo" className="mx-auto h-12 mb-4 object-contain" loading="eager" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Join TagTeam to find accountability partners</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-0">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input id="email" type="email" placeholder="Your email" {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })} className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <Input id="password" type="password" placeholder="Create a password" {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })} className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === watchPassword || "Passwords do not match"
              })} className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl" />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-black text-white hover:bg-black/90 py-0 my-[24px] rounded-lg">
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/signin" className="text-[rgba(130,122,255,1)] font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>;
};

export default SignUp;
