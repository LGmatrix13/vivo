import { z } from "zod";

export const Round = z.object({
  id: z.coerce.number({ message: "Id is required" }),
  zoneId: z.coerce.number({ message: "Zone Id is required" }),
  time: z.coerce.date({ message: "Time is required" }),
  description: z.string({ message: "Description is required" }),
  violations: z.string().optional().nullable(),
  outstandingWorkOrders: z.string().optional().nullable(),
});

export const CreatedRound = Round.extend({
  id: z.undefined(),
});

export const UpdatedRound = Round.extend({
  time: z.undefined(),
});
