import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
export const AppHeader = () => {
  const navigate = useNavigate();
  return <div className="pt-[20px] pb-[11px] px-[15px] border-b py-[21px]">
      <div className="flex w-full items-center justify-between">
        <Link to="/">
          <img src="https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/0d01db784baab711236c04557204350e8d25d164" alt="TagTeam Logo" className="aspect-[3.27] object-contain w-[124px]" />
        </Link>
        <button className="bg-[rgba(203,200,255,1)] flex min-h-10 items-center gap-2.5 overflow-hidden justify-center w-10 h-10 rounded-[100px]" aria-label="Notifications" onClick={() => navigate("/notifications")} style={{
        boxShadow: "0 1px 2px rgba(130,122,255,0.04)"
      }}>
          <Bell className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>;
};