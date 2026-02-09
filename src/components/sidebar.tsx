import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import type { sidebarSchema } from "./sidebar";

export function Sidebar({
  isCollapsed,
  toggleSidebar,
}: z.infer<typeof sidebarSchema>) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (!isCollapsed) {
          toggleSidebar();
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isCollapsed, toggleSidebar]);

  const menuItems = [
    { title: "Dashboard", icon: "Home", path: "/" },
    { title: "Settings", icon: "Settings", path: "/settings" },
  ];

  return (
    <aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      ref={sidebarRef}
    >
      <div className="content">
        <div className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? "☰" : "✕"}
        </div>
        <nav>
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="menu-item">
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
