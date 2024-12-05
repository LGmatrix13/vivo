import { z } from "zod";

export const masterCSV = z.object({
  Id: z.coerce.number(),
  FirstName: z.string(),
  LastName: z.string(),
  Building: z.string(),
  RoomNumber: z.string(),
  RoomType: z.string(),
  Zone: z.string(),
  RA: z.string(),
  State: z.string(),
  PhoneNumber: z.string(),
  Email: z.string(),
  Mailbox: z.coerce.number(),
  Class: z.string(),
  Gender: z.string(),
});