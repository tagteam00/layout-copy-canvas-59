
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import { PersonalInfoSection } from "./edit-form/PersonalInfoSection";
import { BioSection } from "./edit-form/BioSection";

import { PhotoSection } from "./edit-form/PhotoSection";
import { InstagramSection } from "./edit-form/InstagramSection";
import { toast } from "sonner";
import { useUserData } from "@/hooks/useUserData";

interface EditProfileSheetProps {
  currentProfile: {
    fullName: string;
    username: string;
    interests: string[];
    dateOfBirth: string;
    gender: string;
    commitmentLevel: string;
    city: string;
    country: string;
    occupation: string;
    bio: string;
    avatarUrl?: string | null;
    fullAddress?: string;
    coordinates?: { lat: number; lng: number };
    instagramUrl?: string;
  };
  onProfileUpdate: () => void;
}

export const EditProfileSheet: React.FC<EditProfileSheetProps> = ({
  currentProfile,
  onProfileUpdate,
}) => {
  const [formData, setFormData] = React.useState(currentProfile);
  const [profileImage, setProfileImage] = React.useState<File | null>(null);
  
  const { saveUserData } = useUserData();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image change with better error handling
  const handleImageChange = async (file: File | null) => {
    setProfileImage(file);
    
    // Auto-save the photo change immediately
    if (!navigator.onLine) {
      toast.error("No internet connection. Photo will be saved when connection is restored.");
      return;
    }

    setIsSaving(true);
    try {
      const success = await saveUserData({
        fullName: formData.fullName,
        username: formData.username,
        interests: currentProfile.interests,
        dateOfBirth: currentProfile.dateOfBirth,
        gender: currentProfile.gender,
        commitmentLevel: currentProfile.commitmentLevel,
        city: formData.city,
        country: formData.country,
        occupation: formData.occupation,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        fullAddress: formData.fullAddress,
        coordinates: formData.coordinates,
        instagramUrl: formData.instagramUrl
      }, file);

      if (success) {
        toast.success(file ? "Profile photo updated successfully" : "Profile photo removed");
        // Update form data with potentially new avatar URL
        if (file) {
          // The saveUserData should have updated the avatar URL, refresh the profile
          onProfileUpdate();
        }
      } else {
        toast.error("Failed to save profile photo. Please try again.");
        // Reset the profile image state on failure
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error saving profile photo:', error);
      toast.error("An error occurred while saving your photo. Please try again.");
      setProfileImage(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields before saving
    if (!formData.fullName?.trim()) {
      toast.error("Full name is required");
      return;
    }
    
    if (!formData.username?.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your network and try again.");
      return;
    }

    setIsSaving(true);
    try {
      const success = await saveUserData({
        fullName: formData.fullName,
        username: formData.username,
        interests: currentProfile.interests, // Keep current interests unchanged
        dateOfBirth: currentProfile.dateOfBirth,
        gender: currentProfile.gender,
        commitmentLevel: currentProfile.commitmentLevel,
        city: formData.city,
        country: formData.country,
        occupation: formData.occupation,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        fullAddress: formData.fullAddress,
        coordinates: formData.coordinates,
        instagramUrl: formData.instagramUrl
      }, profileImage);
      
      if (success) {
        toast.success("Profile updated successfully");
        onProfileUpdate();
      } else {
        toast.error("Failed to update profile. Please check your information and try again.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(`Failed to update profile: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-gray-100/80 hover:bg-gray-200/80"
        >
          <Pencil className="h-5 w-5 text-gray-900" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-4">
          <PhotoSection 
            avatarUrl={formData.avatarUrl}
            username={formData.username}
            onImageChange={handleImageChange}
          />
          <PersonalInfoSection
            fullName={formData.fullName}
            username={formData.username}
            city={formData.city}
            country={formData.country}
            occupation={formData.occupation}
            fullAddress={formData.fullAddress}
            onInputChange={handleInputChange}
          />
          <BioSection 
            bio={formData.bio} 
            onInputChange={handleInputChange} 
          />
          <InstagramSection
            instagramUrl={formData.instagramUrl || ''}
            onInputChange={handleInputChange}
          />
          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
