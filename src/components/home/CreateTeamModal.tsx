import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (team: any) => void;
  categories: string[];
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
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
    onClose();
  };

  const resetForm = () => {
    setTeamName("");
    setSelectedCategory("");
    setFrequency("Everyday");
    setMembers("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Team</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-2 border border-[rgba(130,122,255,0.41)] rounded-xl"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? "bg-[rgba(130,122,255,1)] text-white"
                      : "bg-gray-100 text-gray-700"
                  } px-3 py-1 rounded-xl text-xs`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2 border border-[rgba(130,122,255,0.41)] rounded-xl"
            >
              <option value="Everyday">Everyday</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Team Members
            </label>
            <input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="w-full p-2 border border-[rgba(130,122,255,0.41)] rounded-xl"
              placeholder="e.g. Parth - Divij"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[rgba(130,122,255,1)] text-white rounded-xl"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
