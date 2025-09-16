import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { useInterests } from "@/hooks/useInterests";
import { useUserData } from "@/hooks/useUserData";
import { formatInterestName, formatCategoryName } from "@/utils/interestUtils";
import { useToast } from "@/hooks/use-toast";

interface ManageInterestsSheetProps {
  currentInterests: string[];
  onUpdate: () => Promise<void>;
  children: React.ReactNode;
}

export const ManageInterestsSheet: React.FC<ManageInterestsSheetProps> = ({
  currentInterests,
  onUpdate,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [tempInterests, setTempInterests] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { interests, loading } = useInterests();
  const { saveUserData, getUserData } = useUserData();
  const { toast } = useToast();

  const MAX_INTERESTS = 3;

  // Initialize temp interests when sheet opens
  useEffect(() => {
    if (open) {
      setTempInterests([...currentInterests]);
      setSelectedCategory("");
    }
  }, [open, currentInterests]);

  // Get unique categories from interests
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(interests.map(interest => interest.category)));
    return uniqueCategories.sort();
  }, [interests]);

  // Filter interests by selected category
  const filteredInterests = useMemo(() => {
    if (!selectedCategory) return [];
    return interests.filter(interest => interest.category === selectedCategory);
  }, [interests, selectedCategory]);

  const handleAddInterest = (interestId: string) => {
    if (tempInterests.includes(interestId)) {
      return; // Already selected
    }
    
    if (tempInterests.length >= MAX_INTERESTS) {
      toast({
        title: "Maximum interests reached",
        description: `You can only select up to ${MAX_INTERESTS} interests`,
        variant: "destructive"
      });
      return;
    }
    
    setTempInterests(prev => [...prev, interestId]);
    setSelectedCategory(""); // Reset category selection
  };

  const handleRemoveInterest = (interestId: string) => {
    setTempInterests(prev => prev.filter(id => id !== interestId));
  };

  const handleConfirm = async () => {
    if (tempInterests.length === 0) {
      toast({
        title: "No interests selected",
        description: "Please select at least one interest",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const userData = await getUserData();
      if (userData) {
        const updatedData = {
          ...userData,
          interests: tempInterests
        };
        
        const success = await saveUserData(updatedData);
        if (success) {
          toast({
            title: "Success",
            description: "Interests updated successfully!"
          });
          await onUpdate();
          setOpen(false);
        } else {
          toast({
            title: "Error",
            description: "Failed to update interests",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error updating interests:", error);
      toast({
        title: "Error",
        description: "Failed to update interests",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const availableInterests = filteredInterests.filter(
    interest => !tempInterests.includes(interest.id)
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Manage Your Interests</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Current Interests */}
          <div>
            <h3 className="font-medium mb-3">Your Interests ({tempInterests.length}/{MAX_INTERESTS})</h3>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-muted/20">
              {tempInterests.length > 0 ? (
                tempInterests.map((interestId) => (
                  <Badge
                    key={interestId}
                    variant="secondary"
                    className="text-white px-3 py-2 bg-[#6be04d] flex items-center gap-1"
                  >
                    {formatInterestName(interestId)}
                    <button
                      onClick={() => handleRemoveInterest(interestId)}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">No interests selected</span>
              )}
            </div>
          </div>

          {/* Add New Interest */}
          <div className="space-y-4">
            <h3 className="font-medium">Add New Interest</h3>
            
            {/* Category Selection */}
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category first" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {formatCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interest Selection */}
            {selectedCategory && (
              <div>
                <Select onValueChange={handleAddInterest} value="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interest to add" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {availableInterests.map((interest) => (
                      <SelectItem key={interest.id} value={interest.id}>
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          {formatInterestName(interest.name)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableInterests.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    All interests from this category are already selected
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            disabled={isLoading || tempInterests.length === 0}
          >
            {isLoading ? "Updating..." : "Confirm Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};