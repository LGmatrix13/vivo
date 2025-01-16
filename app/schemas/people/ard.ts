import { z } from "zod";

export const ARD = z.object({
  id: z.coerce.number(),
  residentId: z.coerce.number(),
  staffId: z.coerce.number(),
});

export const CreatedARD = ARD.extend({
  id: z.undefined(),
});
