
import React from "react";
import { Link } from "react-router-dom";
import { Home, Users, User } from "lucide-react";

interface NavItem {
  name: string;
  icon: string | React.ReactNode;
  path: string;
  isActive: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home />,
  Tagteam: <Users />,
  Profile: <User />
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
}) => {
  const filteredItems = items.filter(item => item.name !== "Notifications");
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex w-full items-center gap-2 pt-3 pb-4 px-3 bg-white border-t border-gray-200 max-w-[480px] mx-auto z-50">
      {filteredItems.map((item, index) => {
        const IconComponent = iconMap[item.name];
        // Determine color/fill
        const iconColor = item.isActive ? "#000" : "#9F9EA1";
        // For fill, only Home icon gets filled, others are outlined; adjust as desired
        const iconStyle = item.isActive
          ? { fill: "#000", color: "#000", strokeWidth: 2 }
          : { fill: "none", color: "#9F9EA1", strokeWidth: 2 };

        return (
          <Link
            key={index}
            to={item.path}
            className={`self-stretch flex flex-col items-center text-xs whitespace-nowrap text-center leading-[22px] flex-1 shrink basis-[0%] my-auto ${item.isActive ? "text-black font-bold" : "text-[rgba(111,111,111,1)] font-normal"}`}
          >
            <div
              className={item.isActive ? "bg-[rgba(130,122,255,0.13)] self-center flex min-h-8 w-16 items-center gap-2.5 overflow-hidden justify-center px-[3px] py-[7px] rounded-xl" : ""}
            >
              {IconComponent &&
                React.cloneElement(
                  IconComponent as React.ReactElement,
                  {
                    size: 24,
                    color: iconColor,
                    fill: item.isActive ? "#000" : "none",
                    strokeWidth: item.isActive ? 2.5 : 2
                  }
                )}
            </div>
            <div className="mt-1">{item.name}</div>
          </Link>
        );
      })}
    </nav>
  );
};
