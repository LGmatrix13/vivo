import { z } from "zod";

const StaffShift = z.object({
  id: z.coerce.number(),
  staffId: z.coerce.number({ message: "Staff Id is required" }),
  date: z.coerce.date({ message: "Date is required" }).transform((date) => date.toISOString().slice(0, 16)),
});

export const CreatedStaffShift = StaffShift.extend({
  id: z.undefined(),
});

export const UpdatedStaffShift = StaffShift.extend({
  date: z.undefined(),
});
