
import React, { useState } from "react";
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

  // Watch password to use in validation
  const watchPassword = watch("password", "");

  const onSubmit = async data => {
    try {
      setLoading(true);

      // Sign up with Supabase
      const {
        data: authData,
        error
      } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          // For testing purposes, we're not requiring email verification
          emailRedirectTo: window.location.origin,
          data: {
            full_name: data.email.split('@')[0] // Just a placeholder for testing
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      if (authData && authData.user) {
        toast.success("Account created successfully!");
        
        // For testing, we'll sign in the user immediately after sign up
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        });
        
        if (signInError) {
          toast.error("Sign in failed after registration: " + signInError.message);
          navigate("/signin");
          return;
        }
        
        // Redirect to onboarding page
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Signup error:", error);
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
                  value: 8,
                  message: "Password must be at least 8 characters"
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
