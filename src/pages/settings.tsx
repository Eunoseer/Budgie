import { z } from "zod";

import type { settingsSchema } from "./settings";

export function Settings({
  isLightMode,
  toggleIsLightMode,
}: z.infer<typeof settingsSchema>) {
  return (
    <>
      <header className="header">
        <h1>Settings</h1>
      </header>

      <section className="card v100">
        <button
          onClick={() => toggleIsLightMode((prev) => !prev)}
          style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}
        >
          Toggle {isLightMode ? "Dark" : "Light"} Mode
        </button>
      </section>
    </>
  );
}
