import { z } from "zod";

export const CreatedWorkOrder = z.object({
  roomId: z.coerce.number(),
  room: z.string(),
  issues: z.string().transform((val) => JSON.parse(val)),
  roomType: z.enum([
    "UPPER_CAMPUS",
    "COLONIAL_QUAD",
    "COLONIAL_TRIPLE",
    "COLONIAL_DOUBLE",
  ]),
});

export const DeletedWorkOrder = z.object({
  id: z.coerce.number(),
});
