import { z } from "zod";

export const ColonialDoubleIssues = z.object({
  foyerKitchenDiningEntryDoor: z.string().optional(),
  foyerKitchenDiningCeiling: z.string().optional(),
  foyerKitchenDiningFloor: z.string().optional(),
  foyerKitchenDiningWalls: z.string().optional(),
  foyerKitchenDiningSinkDisposal: z.string().optional(),
  foyerKitchenDiningCountertops: z.string().optional(),
  foyerKitchenDiningDishwasher: z.string().optional(),
  foyerKitchenDiningWasherDryer: z.string().optional(),
  foyerKitchenDiningRefrigerator: z.string().optional(),
  foyerKitchenDiningStoveOven: z.string().optional(),
  foyerKitchenDiningWallCabinets: z.string().optional(),
  foyerKitchenDiningTable: z.string().optional(),
  foyerKitchenDiningChairs: z.string().optional(),
  foyerKitchenDiningFireExtinguisher: z.string().optional(),
  livingRoomCeiling: z.string().optional(),
  livingRoomFloorCarpet: z.string().optional(),
  livingRoomWalls: z.string().optional(),
  livingRoomSofa: z.string().optional(),
  livingRoomChair: z.string().optional(),
  livingRoomSideTable: z.string().optional(),
  livingRoomTVStand: z.string().optional(),
  livingRoomWindowBlinds: z.string().optional(),
  bathroomEntryDoor: z.string().optional(),
  bathroomCeiling: z.string().optional(),
  bathroomFloor: z.string().optional(),
  bathroomWalls: z.string().optional(),
  bathroomCabinet: z.string().optional(),
  bathroomMirror: z.string().optional(),
  bathroomSinkCounter: z.string().optional(),
  bathroomTubShowerCurtain: z.string().optional(),
  bathroomToilet: z.string().optional(),
  bedroomLeftEntryDoor: z.string().optional(),
  bedroomLeftCeiling: z.string().optional(),
  bedroomLeftFloorCarpet: z.string().optional(),
  bedroomLeftWalls: z.string().optional(),
  bedroomLeftBedMattress: z.string().optional(),
  bedroomLeftClosetMirror: z.string().optional(),
  bedroomLeftDeskChair: z.string().optional(),
  bedroomLeftDresser: z.string().optional(),
  bedroomRightEntryDoor: z.string().optional(),
  bedroomRightCeiling: z.string().optional(),
  bedroomRightFloorCarpet: z.string().optional(),
  bedroomRightWalls: z.string().optional(),
  bedroomRightBedMattress: z.string().optional(),
  bedroomRightClosetMirror: z.string().optional(),
  bedroomRightDeskChair: z.string().optional(),
  bedroomRightDresser: z.string().optional(),
});

export const UpsertedColonialDouble = ColonialDoubleIssues.extend({
  id: z.coerce.number().optional(),
  studentSignature: z.string({ message: "Student Signature is required" }),
});
