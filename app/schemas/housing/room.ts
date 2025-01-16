import { z } from "zod";

export const Room = z.object({
  id: z.coerce.number(),
  roomNumber: z.string(),
  buildingId: z.coerce.number(),
  zoneId: z.coerce.number(),
  capacity: z.coerce.number(),
});

export const CreatedRoom = Room.extend({
  id: z.undefined(),
});
