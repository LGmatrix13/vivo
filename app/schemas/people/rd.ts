import { z } from "zod";

export const RD = z.object({
  id: z.coerce.number(),
  firstName: z.string({ message: "First Name is required" }),
  lastName: z.string({ message: "Last Name is required" }),
  emailAddress: z.string().email({ message: "Invalid email format" }).transform((value) => value.toUpperCase()),
  mailbox: z.string({ message: "Mailbox is required" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
});

export const CreatedRD = RD.extend({
  id: z.undefined(),
});
