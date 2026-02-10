import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Sidebar } from "./components/sidebar.tsx";
import Dashboard from "./pages/dashboard.tsx";
import { Settings } from "./pages/settings.tsx";
import "./App.css";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLightMode, setIsLightMode] = useState(() => {
    const savedMode = localStorage.getItem("lightMode") === "true";
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return savedMode ? savedMode : systemPrefersDark ? false : true;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const savedMode = localStorage.getItem("lightMode") === "true";
      const systemPrefersDark = e.matches;
      const currentMode = savedMode
        ? savedMode
        : systemPrefersDark
          ? false
          : true;
      setIsLightMode(currentMode);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem("lightMode", isLightMode.toString());
    if (isLightMode) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [isLightMode]);

  return (
    <BrowserRouter>
      <div className="container">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
        <main className={`content ${isCollapsed ? "" : "content-overlay"}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/settings"
              element={
                <Settings
                  isLightMode={isLightMode}
                  toggleIsLightMode={() => setIsLightMode(!isLightMode)}
                />
              }
            />
          </Routes>
        </main>
        <footer className="footer">
          <a href="https://github.com/Eunoseer/Budgie">
            <img src="./github.svg" alt="github"></img>
            &nbsp;Github - Budgie - 2026
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
