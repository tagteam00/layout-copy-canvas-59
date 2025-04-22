import React from "react";

interface UserStatsProps {
  count: number;
}

export const UserStats: React.FC<UserStatsProps> = ({ count }) => {
  return (
    <div className="bg-[rgba(140,255,110,0.5)] border self-stretch text-[rgba(11,11,11,1)] whitespace-nowrap text-center w-[51px] my-auto p-2 rounded-xl border-[rgba(203,200,255,0.04)] border-solid">
      <div className="text-[32px] font-bold leading-none">{count}</div>
      <div className="text-xs font-light leading-[14px]">
        Active
        <br />
        Teams
      </div>
    </div>
  );
};
