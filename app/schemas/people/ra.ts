import { z } from "zod";

export const RA = z.object({
  id: z.coerce.number(),
  alias: z.string(),
  residentId: z.coerce.number(),
  staffId: z.coerce.number(),
});

export const CreatedRA = RA.extend({
  id: z.undefined(),
});
