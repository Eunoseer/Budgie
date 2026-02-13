import { z } from "zod";

import { settingsSchema } from "./settings";
import type { localModesType } from "./settings";
import { Keywords } from "../components/keywords.tsx";
import { initialAccountNames, initialPaymentCategories } from "../App.ts";

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

      <section className="card">
        <h2>Account Names</h2>
        <Keywords
          type={"accountName"}
          placeholder={"Enter account name"}
          initialValues={initialAccountNames}
        />
      </section>

      <section className="card">
        <h2>Payment Categories</h2>
        <Keywords
          type={"paymentCategory"}
          placeholder={"Enter payment category"}
          initialValues={initialPaymentCategories}
        />
      </section>
    </>
  );
}
