
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ArrowLeft } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const Settings = () => {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFinalDeleteDialog, setShowFinalDeleteDialog] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully logged out");
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      const { error } = await supabase.functions.invoke('delete-account', {
        body: { confirm: true }
      });
      
      if (error) throw error;
      
      // Sign out after successful deletion
      await supabase.auth.signOut();
      toast.success("Account deleted successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  const handleFirstDeleteConfirm = () => {
    setShowDeleteDialog(false);
    setShowFinalDeleteDialog(true);
  };

  return (
    <main className="bg-[#F8F7FF] min-h-screen max-w-[480px] w-full mx-auto relative p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Account</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowLogoutDialog(true)} 
            className="w-full justify-start text-slate-50 px-[16px] bg-black py-[26px] rounded-lg"
          >
            Log Out
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)} 
            className="w-full justify-start bg-orange-700 hover:bg-orange-600"
          >
            Deactivate Account
          </Button>
        </section>
      </div>

      <BottomNavigation />

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Log Out"
        description="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
        onConfirm={handleLogout}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Account"
        description="Are you sure you want to permanently delete your account? This will remove all your data including teams, activities, and profile information. This action cannot be undone."
        confirmText="Continue"
        cancelText="Cancel"
        onConfirm={handleFirstDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={showFinalDeleteDialog}
        onOpenChange={setShowFinalDeleteDialog}
        title="Final Warning"
        description="This is your final warning. Are you absolutely sure you want to delete your account forever? This action cannot be undone."
        confirmText="Delete Forever"
        cancelText="Keep Account"
        onConfirm={handleDeactivateAccount}
      />
    </main>
  );
};

export default Settings;
