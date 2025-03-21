import { z } from "zod";

export const UpdatedSubmittedRCI = z.object({
  id: z.coerce.number(),
  status: z.enum(
    [
      "AWAITING_RESIDENT",
      "AWAITING_RA",
      "ACTIVE",
      "RESIDENT_CHECKOUT",
      "RA_CHECKOUT",
      "CHECKED_OUT",
    ],
    { message: "Status is required" }
  ),
});
