import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Sidebar } from "./components/sidebar.tsx";
import Dashboard from "./pages/dashboard.tsx";
import { Settings } from "./pages/settings.tsx";
import "./App.css";

function getPreferredMode(): "light" | "dark" {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches ? "dark" : "light";
}

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [localMode, setLocalMode] = useState(() => {
    const savedMode = localStorage.getItem("localMode");
    return savedMode || getPreferredMode();
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const savedMode = localStorage.getItem("localMode");
      const systemPrefersDark = e.matches;
      const currentMode = savedMode
        ? savedMode
        : systemPrefersDark
          ? "dark"
          : "light";
      setLocalMode(currentMode);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem("localMode", localMode);
    if (localMode === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [localMode]);

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
                  localMode={localMode}
                  setLocalMode={(mode) => setLocalMode(mode)}
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
