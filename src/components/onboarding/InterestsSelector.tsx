
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useInterests } from "@/hooks/useInterests";
import { toast } from "sonner";
import { formatInterestName, formatCategoryName } from "@/utils/interestUtils";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InterestsSelectorProps {
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const InterestsSelector: React.FC<InterestsSelectorProps> = ({
  selectedInterests,
  onToggleInterest,
  onNext,
  onBack,
}) => {
  const { interests, loading, error, retry, isRetrying } = useInterests();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const isOnline = navigator.onLine;

  // Get unique categories from interests
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(interests.map(interest => interest.category))];
    return uniqueCategories;
  }, [interests]);

  // Filter interests by selected category
  const filteredInterests = useMemo(() => {
    if (!selectedCategory) return [];
    return interests.filter(interest => interest.category === selectedCategory);
  }, [interests, selectedCategory]);

  const handleInterestSelection = (interest: string) => {
    onToggleInterest(interest);
  };

  const handleRetry = () => {
    console.log('InterestsSelector: Manual retry triggered');
    retry();
  };

  // Enhanced loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Select Your Interest</h2>
        <div className="flex items-center justify-center space-x-2 py-8">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading interests...</span>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button disabled className="bg-gray-400 text-white">
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Enhanced error state with retry functionality
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Select Your Interest</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-red-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">
                Error loading interests
              </p>
              <p className="text-xs text-red-600">
                {error}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full"
            variant="outline"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button disabled className="bg-gray-400 text-white">
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Select Your Interest</h2>
      <p className="text-gray-600 text-sm">Choose one activity you want to be accountable for</p>
      
      <div className="space-y-4">
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {formatCategoryName(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interest Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Interest</label>
          <Select
            value={selectedInterests[0] || ""}
            onValueChange={handleInterestSelection}
            disabled={!selectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an interest" />
            </SelectTrigger>
            <SelectContent>
              {filteredInterests.map((interest) => (
                <SelectItem key={interest.id} value={interest.name}>
                  {formatInterestName(interest.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={selectedInterests.length === 0}
          className="bg-black text-white hover:bg-black/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
