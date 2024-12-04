import { z } from "zod";

export const Room = z.object({
  roomNumber: z.string(),
  buildingId: z.coerce.number(),
  zoneId: z.coerce.number(),
  capacity: z.coerce.number(),
});
