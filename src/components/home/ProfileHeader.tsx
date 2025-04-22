import React from "react";
import { UserStats } from "./UserStats";

interface ProfileHeaderProps {
  username: string;
  interests: string[];
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  interests,
}) => {
  return (
    <div className="pt-[68px] pb-[11px] px-[15px]">
      <div className="w-full">
        <div className="flex w-full items-center gap-[40px_100px] justify-between">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/0d01db784baab711236c04557204350e8d25d164?placeholderIfAbsent=true"
            alt="TagTeam Logo"
            className="aspect-[3.27] object-contain w-[124px] self-stretch shrink-0 my-auto"
          />
          <div
            className="bg-[rgba(203,200,255,1)] self-stretch flex min-h-10 items-center gap-2.5 overflow-hidden justify-center w-10 h-10 my-auto px-[3px] rounded-[100px]"
            aria-label="Notifications"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/896c5c3b54c5436cb14f28a4a582438d894444cc?placeholderIfAbsent=true"
              alt="Notification Bell"
              className="aspect-[0.9] object-contain w-[18px] self-stretch my-auto"
            />
          </div>
        </div>
        <div className="flex w-full items-center gap-[40px_100px] justify-between mt-6">
          <div className="self-stretch w-[180px] my-auto">
            <h1 className="w-[154px] max-w-full text-[32px] text-black font-bold leading-none rounded-[0px_0px_0px_0px]">
              Hello, {username}
            </h1>
            <div className="flex w-full max-w-[180px] items-stretch gap-1 text-xs text-white font-normal whitespace-nowrap leading-none mt-2 rounded-xl">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className="self-stretch bg-[rgba(130,122,255,1)] gap-2.5 px-2 py-1 rounded-xl"
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>
          <UserStats count={2} />
        </div>
      </div>
    </div>
  );
};
