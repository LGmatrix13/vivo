import { z } from "zod";

export const Weekly = z.object({
  id: z.coerce.number(),
  zoneId: z.coerce.number({ message: "Zone Id is required" }),
  staffMeetingSuggetions: z.string().optional().nullable(),
  raResponsibilities: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"], { message: "RA Responsibilities is required" }),
  academics: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"], { message: "Academics is required" }),
  spiritualHealth: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"], { message: "Spiritual Health is required" }),
  physicalHealth: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"], { message: "Physical Health is required" }),
  mentalHealth: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"], { message: "Mental Health is required" }),
  personalLife: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"], { message: "Personal Life is required" }),
  technologyAndMedia: z.enum(["GREAT", "GOOD", "OK", "ROUGH", "REALLY_ROUGH"], { message: "Technology and Media is required" }),
  explainChoices: z.string().optional().nullable(),
});

export const CreatedWeekly = Weekly.extend({
  id: z.undefined(),
});
