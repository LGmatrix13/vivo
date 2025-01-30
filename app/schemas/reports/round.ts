import { z } from "zod";

export const Round = z.object({
  id: z.coerce.number(),
  zoneId: z.coerce.number(),
  time: z.coerce.date(),
  description: z.string(),
});

export const CreatedRound = Round.extend({
  id: z.undefined(),
});

export const UpdatedRound = Round.extend({
  time: z.undefined(),
});
