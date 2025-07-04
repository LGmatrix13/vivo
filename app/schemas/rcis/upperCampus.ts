import { z } from "zod";

export const UpperCampusIssues = z.object({
  doorLocks: z.string().optional(),
  emergencyItems: z.string().optional(),
  walls: z.string().optional(),
  floor: z.string().optional(),
  ceiling: z.string().optional(),
  lightFixtures: z.string().optional(),
  closetWardrobeMirror: z.string().optional(),
  windowScreens: z.string().optional(),
  curtainRods: z.string().optional(),
  deskChair: z.string().optional(),
  bedMattress: z.string().optional(),
  dresser: z.string().optional(),
  bathroom: z.string().optional(),
  towelbarRings: z.string().optional(),
});

export const UpsertedUpperCampus = UpperCampusIssues.extend({
  id: z.coerce.number().optional(),
  studentSignature: z.string({ message: "Student Signature is required" }),
});
