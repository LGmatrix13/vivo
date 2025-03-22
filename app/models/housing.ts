import { readBuildings } from "~/repositories/housing/buildings";
import {
  readRoomsAsAdmin,
  readRoomsDropdown,
} from "~/repositories/housing/rooms";

export type IBuilding = Awaited<ReturnType<typeof readBuildings>>[number];
export type IBuildingDropdown = Awaited<
  ReturnType<typeof readBuildingsDropdown>
>[number];
export type IRoom = Awaited<ReturnType<typeof readRoomsAsAdmin>>[number];
export type IRoomDropdown = Awaited<
  ReturnType<typeof readRoomsDropdown>
>[number];
