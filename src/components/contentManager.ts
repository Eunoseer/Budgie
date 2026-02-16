import { z } from "zod";

export const ignoredContent = ["localMode", "initialised"];

export const configSchema = z.object({
  accountName: z.array(z.string()),
  paymentCategory: z.array(z.string()),
});

export const dataSchema = z.array(
  z.object({
    id: z.int(),
    description: z.string(),
    accountName: z.string(),
    frequency: z.string(),
    cost: z.coerce.number(),
    paymentCategory: z.string(),
  }),
);

export type configSchemaType = z.infer<typeof configSchema>;
