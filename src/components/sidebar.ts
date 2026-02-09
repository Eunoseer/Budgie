import { z } from "zod";

export const sidebarSchema = z.object({
  isCollapsed: z.boolean(),
  toggleSidebar: z.function({ input: [], output: z.void() }),
});
