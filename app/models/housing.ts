import { readBuildings, readRooms } from "~/repositories/housing";

export type IBuilding = Awaited<ReturnType<typeof readBuildings>>[number];
export type IRoom = Awaited<ReturnType<typeof readRooms>>[number];
