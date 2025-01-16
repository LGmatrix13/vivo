import { z } from "zod";

const ZoneShift = z.object({
  id: z.coerce.number(),
  zoneId: z.coerce.number(),
  date: z.coerce.date().transform((date) => date?.toISOString().slice(0, 16)),
});

export const CreatedZoneShift = ZoneShift.extend({
  id: z.undefined(),
});

export const UpdatedZoneShift = ZoneShift.extend({
  date: z.undefined(),
});
