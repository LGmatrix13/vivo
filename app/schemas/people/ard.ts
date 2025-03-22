import { z } from "zod";

export const ARD = z.object({
  id: z.coerce.number(),
  residentId: z.coerce.number({ message: "Resident ID is required" }),
  staffId: z.coerce.number({ message: "Staff ID is required" }),
});

export const UpdatedARD = ARD.extend({
  residentId: z.undefined(),
});

export const CreatedARD = ARD.extend({
  id: z.undefined(),
});
