import { buildings, rooms } from "~/repositories/housing";

export type IBuilding = Awaited<ReturnType<typeof buildings>>[number];
export type IRoom = Awaited<ReturnType<typeof rooms>>[number];
