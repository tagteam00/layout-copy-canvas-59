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
    }
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async data => {
    try {
      setLoading(true);

      // Sign up with Supabase
      const {
        data: authData,
        error
      } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      if (authData) {
        toast.success("Account created successfully! Please proceed to onboarding.");
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
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/lovable-uploads/dfdd0e96-f205-4b60-95f6-212079ccd7c1.png" alt="TagTeam Logo" className="mx-auto h-16 mb-4 object-contain" />
          
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
                required: "Email is required"
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
                required: "Please confirm your password"
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