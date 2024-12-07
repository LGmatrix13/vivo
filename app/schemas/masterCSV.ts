import { z } from "zod";

export const MasterCSV = z.object({
  ID: z.coerce.number(),
  "First Name": z.string(),
  "Last Name": z.string(),
  Building: z.string(),
  Suite: z.coerce.boolean().optional(),
  Room: z.string(),
  RoomType: z.string(),
  Zone: z.string(),
  RA: z.string(),
  City: z.string(),
  State: z.string(),
  Phone: z.string(),
  Email: z.string().email(),
  Mailbox: z.coerce.number(),
  Class: z.string(),
  Gender: z.string(),
});
