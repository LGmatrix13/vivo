import { sql, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { CreatedRoom, Room, UpdatedRoomIssues } from "~/schemas/housing/room";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import {
  residentTable,
  roomTable,
  buildingTable,
  zoneTable,
  staffTable,
  roomTypeEnum,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function readRoomsDropdown() {
  const rooms = await db.client
    .select({
      id: roomTable.id,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
    })
    .from(roomTable)
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .groupBy(roomTable.id, buildingTable.id)
    .orderBy(buildingTable.name, roomTable.roomNumber);

  return rooms;
}

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
      roomType: roomTable.roomType,
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
      roomType: roomTable.roomType,
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

export async function updateRoomIssues(values: Values) {
  const { success, data } = UpdatedRoomIssues.safeParse(values);

  if (success) {
    await db.client
      .update(roomTable)
      .set({ issuesRCI: data.issuesRCI })
      .where(eq(roomTable.id, data.id));
  }
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
  return await db.insert(request, roomTable, CreatedRoom, values, true, {
    message: "Created Room",
    level: "success",
  });
}
