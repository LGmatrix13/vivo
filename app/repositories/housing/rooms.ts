import { sql, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { CreatedRoom, Room} from "~/schemas/housing/room";
import { db } from "~/utilties/postgres.server";
import mutate from "~/utilties/mutate.server";
import {
  residentTable,
  roomTable,
  buildingTable,
  zoneTable,
  staffTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

/**
 * reads the rooms from the roomTable in the database with the specified properties in the .select statement
 * @returns a list of rooms from the database
 */
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

/**
 * This selects all rooms in the roomTable in the database, since the admin has access to all rooms
 * all rooms are selected
 * @returns a list of all rooms
 */
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

/**
 * This selects rooms in the roomTable in the database, based on the RDs id. This works by selecting
 * all of the rooms in that RDs building.
 * @returns a list of rooms
 */
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

/**
 * Deletes a specific room from the roomTable in the database
 * @returns a message as to whether the deletion was a success or not
 */
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

/**
 * Updates a specific rooms issues in the roomTable in the database
 * @returns a message as to whether the update was a success or not
 */
export async function updateRoomIssues(values: Values, request: Request) {
    await db.client
      .update(roomTable)
      .set({ issuesRCI: values.issuesRCI })
      .where(eq(roomTable.id, values.id));
      
    return mutate(request.url, {
      message: "RCI draft updated",
      level: "success",
    });
}

/**
 * Updates a specific room in the roomTable in the database
 * @returns a message as to whether the update was a success or not
 */
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

/**
 * Creates a new room in the roomTable in the database
 * @returns a message as to whether the creation was a success or not
 */
export async function createRoom(values: Values, request: Request) {
  return await db.insert(request, roomTable, CreatedRoom, values, true, {
    message: "Created Room",
    level: "success",
  });
}

/**
 * gets a rooms rci draft from the roomtable based on a room id
 * @returns a list of issues from the room as a record
 */
export async function getRoomRCIDraftData(roomId: number) {
  const data = await db.client
    .select({
      issues: roomTable.issuesRCI || {},
    })
    .from(roomTable)
    .where(eq(roomTable.id, roomId));

  if (data.length == 0) {
    return {
      issues: {} as Record<string, string>,
    };
  }

  return {
    issues: data[0].issues as Record<string, string>,
  };
}
