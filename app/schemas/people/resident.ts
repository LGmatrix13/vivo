import { z } from "zod";

export const Resident = z.object({
  id: z.coerce.number(),
  firstName: z.string({ message: "First Name is required" }),
  lastName: z.string({ message: "Last Name is required" }),
  roomId: z.union([z.literal("null").transform(() => null), z.coerce.number({ message: "Room ID must be a number or null" })]),
  emailAddress: z.string().email({ message: "Invalid email format" }).transform((value) => value.toUpperCase()),
  city: z.string({ message: "City is required" }),
  state: z.string({ message: "State is required" }),
  phoneNumber: z.string({ message: "Phone Number is required" }),
  mailbox: z.string({ message: "Mailbox is required" }),
  class: z.string({ message: "Class is required" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
  studentId: z.coerce.number({ message: "Student ID is required" }),
});

export const CreatedResident = Resident.extend({
  id: z.undefined(),
});
