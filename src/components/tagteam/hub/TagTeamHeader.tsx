
import React from "react";
import { checkTagTeamLimit, MAX_ALLOWED_TAGTEAMS } from "@/utils/teamLimitUtils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TagTeamHeaderProps {
  title: string;
}

export const TagTeamHeader: React.FC<TagTeamHeaderProps> = ({ title }) => {
  const { userProfile } = useUserProfile();
  const [activeTeamCount, setActiveTeamCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamCount = async () => {
      if (userProfile.id) {
        try {
          const { count } = await checkTagTeamLimit(userProfile.id);
          setActiveTeamCount(count);
        } catch (error) {
          console.error("Error fetching team count:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTeamCount();
  }, [userProfile.id]);

  const getCountColor = () => {
    if (activeTeamCount === null) return "bg-gray-200 text-gray-700";
    if (activeTeamCount === MAX_ALLOWED_TAGTEAMS) return "bg-amber-100 text-amber-800";
    if (activeTeamCount === MAX_ALLOWED_TAGTEAMS - 1) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="flex items-center justify-between mb-5">
      <h1 className="text-2xl text-black font-bold">{title}</h1>
      
      {loading ? (
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
      ) : activeTeamCount !== null && (
        <Badge variant="outline" className={`${getCountColor()} font-medium`}>
          {activeTeamCount}/{MAX_ALLOWED_TAGTEAMS} Teams
        </Badge>
      )}
    </div>
  );
};
