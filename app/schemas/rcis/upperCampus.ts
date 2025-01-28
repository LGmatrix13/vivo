import { z } from "zod";

export const UpperCampus = z.object({
  roomId: z.coerce.number(),
  doorLocks: z.string(),
  emergencyItems: z.string(),
  walls: z.string(),
  floor: z.string(),
  ceiling: z.string(),
  lightFixtures: z.string(),
  closetWardrobeMirror: z.string(),
  windowScreens: z.string(),
  curtainRods: z.string(),
  deskChair: z.string(),
  bedMattress: z.string(),
  dresser: z.string(),
  bathroom: z.string(),
  towelbarRings: z.string(),
  studentSignature: z.string(),
  raSignature: z.string(),
  studentDate: z.string(),
  RADate: z.string(),
});
