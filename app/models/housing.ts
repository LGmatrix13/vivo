import {
  readBuildings,
  readBuildingsDropdown,
  readRooms,
} from "~/repositories/housing";

export type IBuilding = Awaited<ReturnType<typeof readBuildings>>[number];
export type IBuildingDropdown = Awaited<
  ReturnType<typeof readBuildingsDropdown>
>[number];
export type IRoom = Awaited<ReturnType<typeof readRooms>>[number];
