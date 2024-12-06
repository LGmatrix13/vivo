import { z } from "zod";

export const MasterCSV = z.object({
  id: z.coerce.number(),
  firstName: z.string(),
  lastName: z.string(),
  building: z.string(),
  roomNumber: z.string(),
  roomType: z.string(),
  zone: z.string(),
  ra: z.string(),
  state: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  mailbox: z.coerce.number(),
  class: z.string(),
  gender: z.string(),
});
