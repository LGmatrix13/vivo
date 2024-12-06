import { z } from "zod";

export const Building = z.object({
  id: z.coerce.number().optional(),
  name: z.string(),
  staffId: z.coerce.number(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});
