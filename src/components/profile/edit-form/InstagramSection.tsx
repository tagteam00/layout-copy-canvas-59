import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Instagram } from "lucide-react";
import { validateInstagramHandle, getInstagramValidationError } from "@/utils/instagramValidation";

interface InstagramSectionProps {
  instagramHandle: string;
  onInputChange: (field: string, value: string) => void;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  instagramHandle,
  onInputChange,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    // Use proper validation helper
    if (validateInstagramHandle(value)) {
      onInputChange("instagramHandle", value);
      setValidationError(null);
    } else {
      // Show specific validation error
      const errorMessage = getInstagramValidationError(value);
      setValidationError(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Instagram className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instagramHandle" className="text-sm font-medium text-gray-700">
          Instagram Handle
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            @
          </span>
          <Input
            id="instagramHandle"
            type="text"
            placeholder="username"
            value={instagramHandle}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`pl-8 ${validationError ? 'border-red-500' : ''}`}
            maxLength={30}
          />
        </div>
        {validationError ? (
          <p className="text-xs text-red-500">
            {validationError}
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            Share your Instagram with your TagTeam partners to build stronger connections
          </p>
        )}
      </div>
    </div>
  );
};