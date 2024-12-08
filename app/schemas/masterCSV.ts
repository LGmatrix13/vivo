import { z } from "zod";

export const MasterCSV = z.object({
  studentId: z.coerce.number({ message: "ID is required and must be a number." }),
  firstName: z.string({ message: "First Name is required." }),
  lastName: z.string({ message: "Last Name is required." }),
  room: z.string({ message: "Room is required." }),
  suite: z.coerce
    .boolean({ message: "Suite must be a true/false value." })
    .optional(),
  roomType: z.string({ message: "Room Type is required." }),
  zone: z.string({ message: "Zone is required." }),
  ra: z.string({ message: "RA is required." }),
  city: z.string({ message: "City is required." }),
  state: z.string({ message: "State is required." }),
  phoneNumber: z.string({ message: "Phone is required." }),
  emailAddress: z
    .string({ message: "Email is required." })
    .email({ message: "Email is not formatted correctly." }),
  mailbox: z.coerce.number({
    message: "Mailbox is required and must be a number.",
  }),
  class: z.string({ message: "Class is required." }),
  gender: z.string({ message: "Gender is required." })
  .transform((data) => data === 'M' ? 'MALE' : 'FEMALE')
});
