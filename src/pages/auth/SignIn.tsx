
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const navigate = useNavigate();

  const onSubmit = async data => {
    try {
      setLoading(true);

      // Sign in with Supabase
      const {
        data: authData,
        error
      } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) {
        if (error.message.includes('not confirmed')) {
          // If email isn't confirmed, offer to resend verification
          toast.error("Email not confirmed. Try using the magic link option below.");
          return;
        }
        toast.error(error.message);
        return;
      }
      
      if (authData) {
        toast.success("Signed in successfully!");
        // Check if user has completed onboarding
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        // Redirect to appropriate page based on onboarding status
        navigate(profileData ? "/home" : "/onboarding");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please try again later.");
    } finally {
      setLoading(false);
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
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Magic link sent! Check your email.");
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
