import { z } from "zod";

export const Weekly = z.object({
  id: z.coerce.number(),
  zoneId: z.coerce.number(),
  submittedOn: z.string(),
  outstandingWorkOrders: z.string().optional(),
  raResponsibilities: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"]),
  academics: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"]),
  spiritualHealth: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"]),
  physicalHealth: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"]),
  mentalHealth: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"]),
  personalLife: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"]),
  technologyAndMedia: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"]),
  explainChoices: z.string(),
  time: z.coerce.date(),
});

export const CreatedWeekly = Weekly.extend({
  id: z.undefined(),
});
