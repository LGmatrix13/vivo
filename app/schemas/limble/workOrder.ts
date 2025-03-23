import { z } from "zod";

export const WorkOrder = z.object({
  room: z.string(),
  issues: z.string().transform((val) => JSON.parse(val)),
  roomType: z.enum([
    "UPPER_CAMPUS",
    "COLONIAL_QUAD",
    "COLONIAL_TRIPLE",
    "COLONIAL_DOUBLE",
  ]),
});
