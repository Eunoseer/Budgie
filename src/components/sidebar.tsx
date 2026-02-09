import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export function Sidebar({ isCollapsed, toggleSidebar }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
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
            <Link
              key={item.path}
              to={item.path}
              className="menu-item"
              style={{ display: isCollapsed ? "none" : "block" }}
            >
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
