
import React from "react";

interface EmptySearchStateProps {
  selectedCategory: string;
}

export const EmptySearchState: React.FC<EmptySearchStateProps> = ({ selectedCategory }) => {
  return (
    <div className="text-center text-gray-500 py-4">
      {`No users found with interest in ${selectedCategory}`}
    </div>
  );
};
