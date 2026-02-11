import { z } from "zod";

export type localModesType = "system" | "light" | "dark";

export const settingsSchema = z.object({
  localMode: z.union([z.string()]),
  setLocalMode: z.function({
    input: [z.string()],
    output: z.void(),
  }),
});
