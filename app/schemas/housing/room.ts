import { z } from "zod";

export const Room = z.object({
  id: z.coerce.number(),
  roomNumber: z.string(),
  buildingId: z.coerce.number(),
  zoneId: z.union([z.literal("null").transform(() => null), z.coerce.number()]),
  capacity: z.coerce.number(),
  roomType: z.enum(["UPPER_CAMPUS", "COLONIAL_QUAD", "COLONIAL_TRIPLE","COLONIAL_DOUBLE"])
});

export const CreatedRoom = Room.extend({
  id: z.undefined(),
});
