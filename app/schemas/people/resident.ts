import { z } from "zod";

export const Resident = z.object({
  id: z.coerce.number(),
  firstName: z.string(),
  lastName: z.string(),
  roomId: z.union([z.literal("null").transform(() => null), z.coerce.number()]),
  emailAddress: z.string().email().transform((value) => value.toUpperCase()),
  city: z.string(),
  state: z.string(),
  phoneNumber: z.string(),
  mailbox: z.string(),
  class: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  studentId: z.coerce.number(),
});

export const CreatedResident = Resident.extend({
  id: z.undefined(),
});
