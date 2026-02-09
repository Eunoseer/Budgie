import { z } from "zod";

export const settingsSchema = z.object({
  isLightMode: z.boolean(),
  toggleIsLightMode: z.function({
    input: [z.function({ input: [z.boolean()], output: z.boolean() })],
    output: z.void(),
  }),
});
