import { z } from "zod";

export const Building = z.object({
  id: z.coerce.number(),
  name: z.string({message: "Name is required"}),
  staffId: z.coerce.number({message: "Staff Id is required"}),
  latitude: z.coerce.number({message: "Latitude is required"}),
  longitude: z.coerce.number({message: "Longitude is required"}),
});

export const CreatedBuiling = Building.extend({
  id: z.undefined(),
});
