import {
  readBuildings,
  readBuildingsDropdown,
} from "~/repositories/housing/buildings";
import { readRooms } from "~/repositories/housing/rooms";

export type IBuilding = Awaited<ReturnType<typeof readBuildings>>[number];
export type IBuildingDropdown = Awaited<
  ReturnType<typeof readBuildingsDropdown>
>[number];
export type IRoom = Awaited<ReturnType<typeof readRooms>>[number];
