import { z } from "zod";

export const RDScheduleCSV = z.object({
  id: z.coerce.number().optional(),
  staffId: z.coerce.number({ message: "Staff Id is required" }),
  date: z.coerce
    .date({ message: "Date is required" })
    .transform((value) => value.toISOString()),
});
