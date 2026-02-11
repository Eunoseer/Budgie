import { z } from "zod";

import { settingsSchema } from "./settings";
import type { localModesType } from "./settings";

export function Settings({
  localMode,
  setLocalMode,
}: z.infer<typeof settingsSchema>) {
  const handleModeChange = (mode: localModesType) => {
    setLocalMode(mode);
  };

  return (
    <>
      <header className="header">
        <h1>Settings</h1>
      </header>

      <section className="card">
        <form className="localModeSelector">
          <label>Display Mode</label>
          <label>
            <input
              type="radio"
              name="mode"
              value="system"
              checked={localMode === "system"}
              onChange={() => handleModeChange("system")}
            />
            System
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="light"
              checked={localMode === "light"}
              onChange={() => handleModeChange("light")}
            />
            Light
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="dark"
              checked={localMode === "dark"}
              onChange={() => handleModeChange("dark")}
            />
            Dark
          </label>
        </form>
      </section>
    </>
  );
}
