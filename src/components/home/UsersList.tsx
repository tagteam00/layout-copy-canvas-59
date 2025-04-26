import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { UserData } from "@/hooks/useUserData";
import { Skeleton } from "@/components/ui/skeleton";
interface UsersListProps {
  users: UserData[];
  loading?: boolean;
}
export const UsersList = ({
  users,
  loading = false
}: UsersListProps) => {
  if (loading) {
    return <section className="mt-8">
        <div className="flex items-center gap-[9px] text-xs text-black font-normal mb-4">
          <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <h2 className="whitespace-nowrap">TagTeam Members</h2>
          </div>
          <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({
          length: 4
        }).map((_, index) => <Card key={index} className="border-[rgba(130,122,255,0.41)]">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>)}
        </div>
      </section>;
  }
  return <section className="mt-8 my-0">
      <div className="flex items-center gap-[9px] text-xs text-black font-normal mb-4">
        <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
        <div className="flex items-center gap-2">
          
          <h2 className="whitespace-nowrap text-xs text-[#707070]">Community</h2>
        </div>
        <div className="border flex-1 h-px border-[rgba(0,0,0,0.5)] border-solid" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.length === 0 ? <p className="text-gray-500 col-span-2 text-center py-4">No members found</p> : users.map(user => <Card key={user.username} className="border-[rgba(130,122,255,0.41)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{user.fullName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">@{user.username}</p>
                <div className="flex flex-wrap gap-2">
                  {user.interests && user.interests.map((interest, index) => <Badge key={index} variant="default" className="bg-[rgba(130,122,255,1)]">
                      {interest}
                    </Badge>)}
                </div>
              </CardContent>
            </Card>)}
      </div>
    </section>;
};