import { z } from "zod";

export const Event = z.object({
  id: z.coerce.number(),
  description: z.string(),
  zoneId: z.coerce.number(),
  attendance: z.coerce.number(),
  time: z.coerce.date(),
});

export const CreatedEvent = Event.extend({
  id: z.undefined(),
});

