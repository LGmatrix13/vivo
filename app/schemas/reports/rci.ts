import { z } from "zod";

export const URCI = z.object({
  doorsLocks: z.coerce.string(),
  emergencyItems: z.string(),
  walls: z.coerce.string(),
  floor: z.coerce.string(),
  ceiling: z.coerce.string(),
  lightsFixtures: z.coerce.string(),
  closetWardrobeMirror: z.coerce.string(),
  windowsScreens: z.string(),
  curtainsRods: z.coerce.string(),
  deskChair: z.coerce.string(),
  bedMattress: z.coerce.string(),
  dresser: z.coerce.string(),
  bathroom: z.coerce.string(),
  towelbarRings: z.coerce.string(),

  studentSignature: z.coerce.string(),
  RASignature: z.coerce.string(),
  date: z.coerce.string(),
});

export const CreatedURCI = URCI.extend({
  id: z.undefined(),
});
