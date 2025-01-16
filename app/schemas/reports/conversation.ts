import { z } from "zod";

export const Conversation = z.object({
  id: z.coerce.number(),
  residentId: z.coerce.number(),
  zoneId: z.coerce.number(),
  submitted: z.string(),
  explanation: z.string(),
  level: z.enum(["1", "2", "3"]),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]),
  highPriority: z.coerce.boolean(),
});

export const CreatedConversation = Conversation.extend({
  id: z.undefined(),
});
