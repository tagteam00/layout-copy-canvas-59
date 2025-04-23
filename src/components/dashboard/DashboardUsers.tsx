
import React from "react";
import { UsersList } from "@/components/home/UsersList";

interface DashboardUsersProps {
  users: any[];
  loading: boolean;
}

export const DashboardUsers: React.FC<DashboardUsersProps> = ({
  users,
  loading
}) => (
  <div className="px-4">
    <UsersList users={users} loading={loading} />
  </div>
);
