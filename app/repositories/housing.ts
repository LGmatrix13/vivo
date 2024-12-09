import { sql, eq, asc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/utilties/connection.server";
import {
  buildingTable,
  residentTable,
  roomTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";

export async function readBuildings() {
  const buildings = await db
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
      staffId: staffTable.id,
      latitude: buildingTable.latitude,
      longitude: buildingTable.longitude,
    })
    .from(buildingTable)
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .orderBy(buildingTable.name);

  return buildings;
}

export async function readRooms() {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const rooms = await db
    .select({
      id: roomTable.id,
      building: buildingTable.name,
      buildingId: buildingTable.id,
      raFirstName: raInfoTable.firstName,
      raLastName: raInfoTable.lastName,
      raFullName: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      roomNumber: roomTable.roomNumber,
      capacity: roomTable.capacity,
      zoneId: zoneTable.id,
    })
    .from(roomTable)
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(raInfoTable.id, zoneTable.residentId))
    .groupBy(roomTable.id, buildingTable.id, raInfoTable.id, zoneTable.id)
    .orderBy(buildingTable.name, roomTable.roomNumber);

  return rooms;
}

export async function readBuildingsDropdown() {
  const buildings = await db
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
    })
    .from(buildingTable)
    .orderBy(asc(buildingTable.name));
  return buildings;
}
