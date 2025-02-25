import { z } from "zod";

const ZoneShift = z.object({
  id: z.coerce.number(),
  zoneId: z.coerce.number({ message: "Zone Id is required" }),
  date: z.coerce.date({ message: "Date is required" }).transform((date) => date?.toISOString().slice(0, 16)),
});

export const CreatedZoneShift = ZoneShift.extend({
  id: z.undefined(),
});

export const UpdatedZoneShift = ZoneShift.extend({
  date: z.undefined(),
});
