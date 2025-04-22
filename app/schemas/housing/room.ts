import { z } from "zod";

export const Room = z.object({
  id: z.coerce.number(),
  roomNumber: z.string({ message: "Room Number is required" }),
  buildingId: z.coerce.number({ message: "Building ID is required" }),
  zoneId: z.union([
    z.literal("null").transform(() => null),
    z.coerce.number({ message: "Zone ID must be a number or null" }),
  ]),
  capacity: z.coerce
    .number({ message: "Capacity is required" })
    .refine((val) => val < 6, {
      message: "Capacity must be less than 6",
    }),
  roomType: z.enum(
    ["UPPER_CAMPUS", "COLONIAL_QUAD", "COLONIAL_TRIPLE", "COLONIAL_DOUBLE"],
    { message: "Room Type is required" }
  ),
});

export const UpdatedRoomIssues = z.object({
  id: z.coerce.number(),
  issuesRCI: z.object({}),
});

export const CreatedRoom = Room.extend({
  id: z.undefined(),
});
