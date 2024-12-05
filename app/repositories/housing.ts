import { sql, eq } from "drizzle-orm";
import { db } from "~/utilties/server/database/connection";
import {
  buildingTable,
  residentTable,
  roomTable,
  staffTable,
  zoneTable,
} from "~/utilties/server/database/schema";

export async function readBuildings() {
  const buildings = await db
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
      latitude: buildingTable.latitude,
      longitude: buildingTable.longitude,
    })
    .from(buildingTable)
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .orderBy(buildingTable.name);

  return buildings;
}

export async function readRooms() {
  const rooms = await db
    .select({
      id: roomTable.id,
      building: buildingTable.name,
      raFirstName: residentTable.firstName,
      raLastName: residentTable.lastName,
      raFullName: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      roomNumber: roomTable.roomNumber,
      capacity: roomTable.capacity,
    })
    .from(roomTable)
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .groupBy(roomTable.id, buildingTable.id, residentTable.id)
    .orderBy(buildingTable.name, roomTable.roomNumber);

  return rooms;
}
