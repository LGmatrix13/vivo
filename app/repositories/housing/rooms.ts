import { sql, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Room } from "~/schemas/room";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import {
  residentTable,
  roomTable,
  buildingTable,
  zoneTable,
  staffTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function readRoomsAsAdmin() {
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

  const rooms = await db
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
  const peopleInRoom = await db
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

  await db.delete(roomTable).where(eq(roomTable.id, id));
  return mutate(request.url, {
    message: "Room deleted",
    level: "success",
  });
}

export async function updateRoom(values: Values, request: Request) {
  const updatedRoom = Room.safeParse(values);

  if (updatedRoom.success) {
    await db
      .update(roomTable)
      .set(updatedRoom.data)
      .where(eq(roomTable.id, updatedRoom.data.id!!));
  }
  return mutate(request.url, {
    message: "Updated Room",
    level: "success",
  });
}

export async function createRoom(values: Values, request: Request) {
  const createdRoom = Room.safeParse(values);

  if (createdRoom.success) {
    await db.insert(roomTable).values(createdRoom.data);
    return mutate(request.url, {
      message: "Room Created",
      level: "success",
    });
  }

  return mutate(request.url, {
    message: "Room could not be created",
    level: "failure",
  });
}
