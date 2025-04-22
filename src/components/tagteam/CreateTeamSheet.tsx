
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface CreateTeamSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (team: any) => void;
  categories: string[];
}

export const CreateTeamSheet: React.FC<CreateTeamSheetProps> = ({
  isOpen,
  onClose,
  onCreateTeam,
  categories,
}) => {
  const [teamName, setTeamName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [frequency, setFrequency] = useState("Everyday");
  const [members, setMembers] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
      category: selectedCategory,
      timeLeft: "24hrs Left",
      frequency: frequency,
      members: members,
    };

    onCreateTeam(newTeam);
    resetForm();
  };

  const resetForm = () => {
    setTeamName("");
    setSelectedCategory("");
    setFrequency("Everyday");
    setMembers("");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-4/5 rounded-t-xl">
        <SheetHeader className="mb-6">
          <SheetTitle>Create New TagTeam</SheetTitle>
          <SheetDescription>
            Form a new accountability partnership
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <Input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
              placeholder="Name your TagTeam"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === category
                      ? "bg-[rgba(130,122,255,1)]"
                      : "hover:bg-[rgba(130,122,255,0.1)]"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <Select
              value={frequency}
              onValueChange={setFrequency}
            >
              <SelectTrigger className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Everyday">Everyday</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Weekdays">Weekdays</SelectItem>
                <SelectItem value="Weekends">Weekends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Partner's Name
            </label>
            <Input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
              placeholder="e.g. Parth - Divij"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-black/90"
            >
              Create Team
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
