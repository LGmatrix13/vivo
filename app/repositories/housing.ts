import { sql, eq, asc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Building } from "~/schemas/building";
import { Room } from "~/schemas/room";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import {
  buildingTable,
  residentTable,
  roomTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

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

export async function createBuilding(values: Values, request: Request) {
  const createdBuilding = Building.safeParse(values);

  if (createdBuilding.success) {
    await db.insert(buildingTable).values(createdBuilding.data);

    return mutate(request.url, {
      message: "Buidling Created",
      level: "success",
    });
  }
}

export async function deleteBuilding(values: Values, request: Request) {
  await db
    .delete(buildingTable)
    .where(eq(buildingTable.id, Number(values["id"])));

  return mutate(request.url, {
    message: "Building Deleted",
    level: "success",
  });
}

export async function updateBuilding(values: Values, request: Request) {
  const updatedBuilding = Building.safeParse(values);

  if (updatedBuilding.success) {
    await db
      .update(buildingTable)
      .set(updatedBuilding.data)
      .where(eq(buildingTable.id, updatedBuilding.data.id!!));

    return mutate(request.url, {
      message: "Building Updated",
      level: "success",
    });
  }

  return mutate(request.url, {
    message: "Building Updated failed",
    level: "failure",
  });
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
