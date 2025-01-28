import { sql, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { CreatedRoom, Room } from "~/schemas/housing/room";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import {
  residentTable,
  roomTable,
  buildingTable,
  zoneTable,
  staffTable,
  rciTypeEnum
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function readRoomsAsAdmin() {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const rooms = await db.client
    .select({
      id: roomTable.id,
      building: buildingTable.name,
      buildingId: buildingTable.id,
      raFirstName: raInfoTable.firstName,
      raLastName: raInfoTable.lastName,
      raFullName: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      roomNumber: roomTable.roomNumber,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
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

export async function readRoomsAsRD(id: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const rooms = await db.client
    .select({
      id: roomTable.id,
      building: buildingTable.name,
      buildingId: buildingTable.id,
      raFirstName: raInfoTable.firstName,
      raLastName: raInfoTable.lastName,
      raFullName: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      roomNumber: roomTable.roomNumber,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      capacity: roomTable.capacity,
      zoneId: zoneTable.id,
    })
    .from(roomTable)
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(raInfoTable.id, zoneTable.residentId))
    .innerJoin(staffTable, eq(staffTable.id, buildingTable.staffId))
    .where(eq(staffTable.id, id))
    .groupBy(roomTable.id, buildingTable.id, raInfoTable.id, zoneTable.id)
    .orderBy(buildingTable.name, roomTable.roomNumber);

  return rooms;
}

export async function deleteRoom(values: Values, request: Request) {
  const id = Number(values["id"]);
  const peopleInRoom = await db.client
    .select({
      fullName: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
    })
    .from(residentTable)
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .where(eq(roomTable.id, id));

  if (peopleInRoom.length) {
    return mutate(request.url, {
      message: "Room has residents assigned",
      level: "failure",
    });
  }

  await db.client.delete(roomTable).where(eq(roomTable.id, id));
  return mutate(request.url, {
    message: "Room deleted",
    level: "success",
  });
}

export async function updateRoom(values: Values, request: Request) {
  return db.update(
    request,
    roomTable,
    Room,
    values,
    (values) => eq(roomTable.id, values.id),
    {
      message: "Updated Room",
      level: "success",
    }
  );
}

export async function createRoom(values: Values, request: Request) {
  return db.insert(request, roomTable, CreatedRoom, values, {
    message: "Created Room",
    level: "success",
  });
}

export async function getRoomTypefromResidentID(residentId: number) {
  const room = await db.client
    .select({
      capacity: roomTable.capacity,
      buildingName: buildingTable.name
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .where(eq(residentTable.id, residentId))
  if (room.length == 0) {
    return "UPPER_CAMPUS"
  }
  if (room[0].buildingName && !room[0].buildingName.toLowerCase().includes("colonial")) {
    return "UPPER_CAMPUS"
  }
  switch(room[0].capacity) {
    case 2: return "APT_DOUBLE";
    case 3: return "APT_TRIPLE";
    case 4: return "APT_QUAD";
    default: return "APT_QUAD";
  }
}

export async function getRoomTypefromZoneID(zoneId: number) {
  const room = await db.client
    .select({
      capacity: roomTable.capacity,
      buildingName: buildingTable.name
    })
    .from(zoneTable)
    .leftJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .where(eq(zoneTable.id, zoneId))
  if (room.length == 0) {
    return "UPPER_CAMPUS"
  }
  if (room[0].buildingName && !room[0].buildingName.toLowerCase().includes("colonial")) {
    return "UPPER_CAMPUS"
  }
  switch(room[0].capacity) {
    case 2: return "APT_DOUBLE";
    case 3: return "APT_TRIPLE";
    case 4: return "APT_QUAD";
    default: return "APT_QUAD";
  }
}
