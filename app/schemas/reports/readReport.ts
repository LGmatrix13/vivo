import { z } from "zod";

export const ReadReport = z.object({
  reportType: z.enum(
    [
      "RCI_ACTIVE",
      "RCI_CHECKED_OUT",
      "CONVERSATION",
      "WEEKLY",
      "ROUND",
      "EVENT",
    ],
    { message: "Report Type is required" }
  ),
  personType: z.enum(["ZONE", "STAFF", "ASSISTANT_STAFF", "ADMIN"], {
    message: "Person Type is required",
  }),
  reportId: z.coerce.number({ message: "Report ID is required" }),
  personId: z.coerce.number({ message: "Person ID is required" }),
});
