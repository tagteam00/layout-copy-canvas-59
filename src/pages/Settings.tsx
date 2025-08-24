import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ArrowLeft } from "lucide-react";
const Settings = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully logged out");
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };
  const handleDeactivateAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate your account? This will permanently delete your data and cannot be undone."
    );
    if (!confirm) return;

    try {
      // Call secure edge function to delete all user data and the auth user
      const { data, error } = await supabase.functions.invoke('delete-account');
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Deletion failed');

      // Sign out locally and redirect
      await supabase.auth.signOut();
      toast.success("Your account has been permanently deleted.");
      navigate("/signup");
    } catch (error: any) {
      console.error("Error deactivating account:", error);
      toast.error(error?.message || "Failed to deactivate account");
    }
  };
  return <main className="bg-[#F8F7FF] min-h-screen max-w-[480px] w-full mx-auto relative p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Account</h2>
          <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-slate-50 px-[16px] bg-black py-[26px] rounded-lg">
            Log Out
          </Button>
          <Button variant="destructive" onClick={handleDeactivateAccount} className="w-full justify-start bg-orange-700 hover:bg-orange-600">
            Deactivate Account
          </Button>
        </section>
      </div>

      <BottomNavigation />
    </main>;
};
export default Settings;