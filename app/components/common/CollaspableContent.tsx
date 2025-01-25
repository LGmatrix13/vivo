import { useState } from "react";
import { ChevronDown } from "./Icons";

interface CollaspableContentProps {
  title: string;
  className?: string;
  collasped?: boolean;
  children: React.ReactNode;
}

export default function CollaspableContent(props: CollaspableContentProps) {
  const { title, children, className, collasped = false } = props;
  const [collapsed, setCollapsed] = useState(collasped);

  function toggleCollapse() {
    setCollapsed(!collapsed);
  }

  return (
    <div className={`space-y-5 ${className || ""}`}>
      <div className="flex items-center">
        <h2 className="font-bold text-lg">{title}</h2>
        <button className="ml-auto order-2" onClick={toggleCollapse}>
          <ChevronDown
            className={`${
              collapsed ? "rotate-180" : ""
            } transition-all ease-in-out duration-200`}
          />
        </button>
      </div>
      {!collapsed && children}
    </div>
  );
}
