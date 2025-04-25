import React from "react";
import { Welcome } from "./Welcome";
import { TagTeamList } from "./TagTeamList";
import { UsersList } from "./UsersList";
import { UserData } from "@/hooks/useUserData";
interface HomeContentProps {
  userProfile: {
    fullName: string;
    interests: string[];
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
  return <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-0 my-[16px]">
        <Welcome fullName={userProfile.fullName} interests={userProfile.interests} loading={loading} />
      </div>
      <TagTeamList teams={tagTeams} onAddTeam={onAddTeam} userName={userProfile.fullName} />
      <div className="px-4">
        <UsersList users={allUsers} loading={loading} />
      </div>
    </div>;
};