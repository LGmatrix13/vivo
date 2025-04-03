import { z } from "zod";

export const Round = z.object({
  id: z.coerce.number({ message: "Id is required" }),
  zoneId: z.coerce.number({ message: "Zone Id is required" }),
  time: z.coerce.date({ message: "Time is required" }),
  description: z.string({ message: "Description is required" }),
  violations: z.string().transform((val) => (!val.length ? null : val)),
  outstandingWorkOrders: z
    .string()
    .transform((val) => (!val.length ? null : val)),
});

export const CreatedRound = Round.extend({
  id: z.undefined(),
});

export const UpdatedRound = Round.extend({
  time: z.undefined(),
});
