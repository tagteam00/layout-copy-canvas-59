
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { compressImage } from "@/utils/imageUtils";
import { toast } from "sonner";

interface ProfileImageUploaderProps {
  currentImageUrl?: string | null;
  onImageChange: (file: File | null) => void;
  getInitials?: (name: string) => string;
  username?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  currentImageUrl,
  onImageChange,
  getInitials = (name) => name?.substring(0, 2)?.toUpperCase() || "?",
  username = "",
  size = "lg",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Determine avatar size based on prop
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20", 
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Compress image
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
      
      // Create preview URL
      const newPreviewUrl = URL.createObjectURL(compressedBlob);
      setPreviewUrl(newPreviewUrl);
      
      // Pass the compressed file to parent
      onImageChange(compressedFile);
      
      const originalSizeKB = Math.round(file.size / 1024);
      const compressedSizeKB = Math.round(compressedFile.size / 1024);
      
      if (originalSizeKB > compressedSizeKB) {
        toast.success(`Image compressed from ${originalSizeKB}KB to ${compressedSizeKB}KB`);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Remove current image
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-md bg-pink-100 text-gray-800`}>
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Profile" className="object-cover" />
          ) : null}
          <AvatarFallback>{getInitials(username)}</AvatarFallback>
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <Button 
            type="button"
            size="icon" 
            className="h-8 w-8 rounded-full bg-[#827AFF] hover:bg-[#6a63d8] text-white shadow-md"
            onClick={handleUploadClick}
            disabled={isLoading}
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          {previewUrl && (
            <Button 
              type="button"
              size="icon" 
              variant="destructive"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={handleRemoveImage}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      
      {isLoading && <p className="text-xs text-gray-500">Processing image...</p>}
    </div>
  );
};
