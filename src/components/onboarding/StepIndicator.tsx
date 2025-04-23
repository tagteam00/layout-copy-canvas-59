import React from "react";
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps
}) => {
  return <div className="flex justify-center items-center mt-4 py-[12px]">
      {Array.from({
      length: totalSteps
    }).map((_, index) => <div key={index} className={`w-3 h-3 rounded-full mx-1 ${index + 1 === currentStep ? 'bg-[rgba(130,122,255,1)]' : 'bg-gray-200'}`} />)}
    </div>;
};