import { z } from "zod";

export const Building = z.object({
  id: z.coerce.number(),
  name: z.string(),
  staffId: z.coerce.number(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export const CreatedBuiling = Building.extend({
  id: z.undefined(),
});
