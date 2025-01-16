import { z } from "zod";

export const Round = z.object({
  id: z.coerce.number(),
  zoneId: z.coerce.number(),
  submitted: z.string(),
  time: z.coerce.date(),
  description: z.string(),
});

export const CreatedRound = Round.extend({
  id: z.undefined(),
});
