import { z } from "zod";

export const Conversation = z.object({
  id: z.coerce.number(),
  residentId: z.coerce.number({ message: "Resident ID is required" }),
  zoneId: z.coerce.number({ message: "Zone ID is required" }),
  explanation: z.string({ message: "Explanation is required" }),
  level: z.enum(["1", "2", "3"], { message: "Level is required" }),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"], {
    message: "Sentiment is required",
  }),
  highPriority: z.preprocess(
    (val) => (val === "false" ? false : Boolean(val)),
    z.boolean({ message: "High Priority status is required" })
  ),
});

export const CreatedConversation = Conversation.extend({
  id: z.undefined(),
});
