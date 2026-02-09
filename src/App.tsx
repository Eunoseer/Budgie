import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Sidebar } from "./components/sidebar.tsx";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import "./App.css";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <footer className="footer">
          <a href="https://github.com/Eunoseer/Budgie">
            <img src="./github.svg" alt="github"></img>
            &nbsp;Github - Budgie
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
