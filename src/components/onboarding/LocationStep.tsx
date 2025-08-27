
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationStepProps {
  onSubmit: (data: { city: string; state: string }) => void;
  onBack: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({ onSubmit, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Where are you located?</h2>
        <p className="text-gray-600 text-sm">This helps us connect you with nearby partners (optional)</p>
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
        <Input
          id="city"
          placeholder="Enter your city"
          {...register("city")}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
        <Input
          id="state"
          placeholder="Enter your state"
          {...register("state")}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => onSubmit({ city: "", state: "" })}
          >
            Skip
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-black/90">
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};
