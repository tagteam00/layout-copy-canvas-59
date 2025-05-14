
import React from "react";

interface TagTeamHeaderProps {
  title: string;
}

export const TagTeamHeader: React.FC<TagTeamHeaderProps> = ({ title }) => {
  return (
    <h1 className="mb-6 font-extrabold text-lg pt-4">{title}</h1>
  );
};
