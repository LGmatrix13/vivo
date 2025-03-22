import { z } from "zod";

export const Event = z.object({
  id: z.coerce.number(),
  description: z.string({ message: "Description is required" }),
  zoneId: z.coerce.number({ message: "Zone ID is required" }),
  attendance: z.coerce.number({ message: "Attendance is required" }).min(0),
  time: z.coerce.date({ message: "Valid date is required" }),
});

export const CreatedEvent = Event.extend({
  id: z.undefined(),
});

export const UpdatedEvent = Event.extend({
  time: z.undefined(),
});
