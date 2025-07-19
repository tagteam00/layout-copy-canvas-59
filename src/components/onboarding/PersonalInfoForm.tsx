
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2 } from "lucide-react";
import { useSanitizedInput } from "@/utils/sanitization";
import { useUsernameValidation } from "@/hooks/useUsernameValidation";

interface PersonalInfoFormProps {
  onSubmit: (data: any) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const { sanitizeText, validateProfile } = useSanitizedInput();
  const { isValid: isUsernameValid, isChecking, error: usernameError, suggestions, validateUsername } = useUsernameValidation();
  
  const selectedGender = watch("gender");
  const usernameValue = watch("username");

  // Validate username as user types
  useEffect(() => {
    if (usernameValue && usernameValue.length >= 3) {
      validateUsername(usernameValue);
    }
  }, [usernameValue, validateUsername]);

  const handleFormSubmit = (data: any) => {
    const result = validateProfile(data);
    if (result.success) {
      // Check username validation before submitting
      if (!isUsernameValid && usernameValue) {
        console.error('Username validation failed');
        return;
      }
      onSubmit(result.data);
    } else {
      console.error('Validation errors:', result.error.errors);
      // Show validation errors to user
      result.error.errors.forEach((error) => {
        console.log(`Validation error: ${error.path.join('.')}: ${error.message}`);
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue("username", suggestion);
  };

  const getUsernameStatus = () => {
    if (!usernameValue || usernameValue.length < 3) return null;
    if (isChecking) return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    if (isUsernameValid) return <Check className="h-4 w-4 text-green-500" />;
    if (usernameError) return <X className="h-4 w-4 text-red-500" />;
    return null;
  };

  const canSubmit = !usernameValue || (usernameValue.length >= 3 && isUsernameValid && !isChecking);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
        <Input
          id="fullName"
          placeholder="Your full name"
          {...register("fullName", { required: "Full name is required" })}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
        <div className="relative">
          <Input
            id="username"
            placeholder="Pick a username"
            {...register("username", { required: "Username is required" })}
            className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl pr-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getUsernameStatus()}
          </div>
        </div>
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message as string}</p>}
        {usernameError && !errors.username && (
          <p className="text-red-500 text-xs mt-1">{usernameError}</p>
        )}
        {suggestions.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Try these suggestions:</p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {isUsernameValid && usernameValue && (
          <p className="text-green-600 text-xs mt-1">✓ Username is available</p>
        )}
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-1">Date of Birth</label>
        <Input
          id="dateOfBirth"
          type="date"
          {...register("dateOfBirth", { required: "Date of birth is required" })}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <RadioGroup 
          value={selectedGender} 
          onValueChange={(value) => setValue("gender", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
        <input type="hidden" {...register("gender", { required: "Gender is required" })} />
        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message as string}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-black text-white hover:bg-black/90"
        disabled={!canSubmit}
      >
        Next
      </Button>
    </form>
  );
};
