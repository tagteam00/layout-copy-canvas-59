
import React from "react";
import { Link } from "react-router-dom";

interface NavItem {
  name: string;
  icon: string;
  path: string;
  isActive: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex w-full items-center gap-2 pt-3 pb-4 px-3 bg-white border-t border-gray-200 max-w-[480px] mx-auto z-50">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`self-stretch flex flex-col ${
            item.isActive
              ? "items-stretch text-black font-bold"
              : "items-center text-[rgba(111,111,111,1)] font-normal"
          } text-xs whitespace-nowrap text-center leading-[22px] flex-1 shrink basis-[0%] my-auto`}
        >
          {item.isActive ? (
            <div className="bg-[rgba(130,122,255,0.41)] self-center flex min-h-8 w-16 items-center gap-2.5 overflow-hidden justify-center px-[3px] py-[7px] rounded-xl">
              <img
                src={item.icon}
                alt={item.name}
                className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
              />
            </div>
          ) : (
            <img
              src={item.icon}
              alt={item.name}
              className="aspect-[1] object-contain w-6"
            />
          )}
          <div className="mt-1">{item.name}</div>
        </Link>
      ))}
    </nav>
  );
};
