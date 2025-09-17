
import React from "react";
import { Welcome } from "./Welcome";
import { TagTeamList } from "./TagTeamList";
import { UsersList } from "./UsersList";
import { UserData } from "@/hooks/useUserData";
import { BugReportSheet } from "@/components/bug-report/BugReportSheet";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface HomeContentProps {
  userProfile: {
    fullName: string;
    interests: string[];
    id?: string;
  };
  loading: boolean;
  tagTeams: any[];
  onAddTeam: () => void;
  allUsers: UserData[];
}

export const HomeContent: React.FC<HomeContentProps> = ({
  userProfile,
  loading,
  tagTeams,
  onAddTeam,
  allUsers
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="my-[15px]">
        <Welcome fullName={userProfile.fullName} interests={userProfile.interests} loading={loading} />
      </div>
      <TagTeamList 
        teams={tagTeams} 
        onAddTeam={onAddTeam} 
        userName={userProfile.fullName} 
        loading={loading}
        currentUserId={userProfile.id}
      />
      <div>
        <UsersList users={allUsers} loading={loading} />
      </div>
      
      <div className="mt-8 pb-4 flex justify-center">
        <BugReportSheet 
          trigger={
            <Button variant="ghost" className="text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              Report a Problem
            </Button>
          }
          pageContext="home"
        />
      </div>
    </div>
  );
};
