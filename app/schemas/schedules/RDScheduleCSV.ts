import { z } from "zod";

export const RDScheduleCSV = z.object({
  id: z.coerce.number().optional(),
  staffId: z.coerce.number(),
  date: z.coerce.date(),
});
