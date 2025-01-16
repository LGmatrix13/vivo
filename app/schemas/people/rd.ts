import { z } from "zod";

export const RD = z.object({
  id: z.coerce.number(),
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string().email(),
  mailbox: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
});

export const CreatedRD = RD.extend({
  id: z.undefined(),
});
