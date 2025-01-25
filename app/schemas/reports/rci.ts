import { count, table } from "node:console";
import { renderToPipeableStream } from "react-dom/server";
import { z } from "zod";

export const URCI = z.object({
  // upper campus RCI items
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
  // colonial RCI items
  keyRecieved: z.coerce.boolean(),
  entryDoor: z.coerce.string(),
  stoveOven: z.coerce.string(),
  countertops: z.coerce.string(),
  cabinets: z.coerce.string(),
  washerDryer: z.coerce.string(),
  refrigerator: z.coerce.string(),
  dishwasher: z.coerce.string(),
  sinkDisposal: z.coerce.string(),
  table: z.coerce.string(),
  chairs: z.coerce.string(),
  fireExtinguisher: z.coerce.string(),
  sofa: z.coerce.string(),
  sideTable: z.coerce.string(),
  tvStand: z.coerce.string(),
  bathMirror: z.coerce.string(),
  bathtubShowerCurtain: z.coerce.string(),
  toilet: z.coerce.string(),
  

  studentSignature: z.coerce.string(),
  RASignature: z.coerce.string(),
  studentDate: z.coerce.string(),
  RADate: z.coerce.string(),
  studentPhone: z.coerce.number(),
});

export const CreatedURCI = URCI.extend({
  id: z.undefined(),
});
