import React from "react";
interface WelcomeProps {
  fullName: string;
  interests: string[];
  loading?: boolean;
}
export const Welcome: React.FC<WelcomeProps> = ({
  fullName,
  interests,
  loading = false
}) => {
  if (loading) {
    return <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex gap-1 mt-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>;
  }
  return <>
      <h1 className="font-bold mb-2 text-3xl">Hello, {fullName}</h1>
      <div className="flex items-center gap-1 mt-2 text-2xl font-extrabold my-0">
        {interests.map((interest, index) => <div key={index} className="bg-[rgba(130,122,255,1)] text-xs text-white px-2 py-1 rounded-xl whitespace-nowrap">
            {interest}
          </div>)}
      </div>
    </>;
};