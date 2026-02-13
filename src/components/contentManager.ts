import { z } from "zod";

export const ignoredContent = ["localMode", "initialised"];

export const configSchema = z.object({
  accountName: z.array(z.string()),
  paymentCategory: z.array(z.string()),
});

export type configSchemaType = z.infer<typeof configSchema>;
