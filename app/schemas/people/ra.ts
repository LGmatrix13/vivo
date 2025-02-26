import { z } from "zod";

export const RA = z.object({
  id: z.coerce.number(),
  alias: z.string({ message: "Alias is required" }),
  residentId: z.coerce.number({ message: "Resident ID is required" }),
  staffId: z.coerce.number({ message: "Staff ID is required" }),
});

export const UpdatedRA = RA.extend({
  residentId: z.undefined(),
});

export const CreatedRA = RA.extend({
  id: z.undefined(),
});
