import { sql, eq, asc, count } from "drizzle-orm";
import { Building } from "~/schemas/building";
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
      numRooms: count(roomTable.id).as("numRooms"),
    })
    .from(buildingTable)
    .leftJoin(roomTable, eq(roomTable.buildingId, buildingTable.id))
    .leftJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .groupBy(buildingTable.id, staffTable.id)
    .orderBy(buildingTable.name);

  return buildings;
}

export async function readBuildingsDropdownAsAdmin() {
  const buildings = await db
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
    })
    .from(buildingTable)
    .orderBy(asc(buildingTable.name));
  return buildings;
}

export async function readBuildingsDropdownAsRD(id: number) {
  const buildings = await db
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
    })
    .from(buildingTable)
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .where(eq(buildingTable.id, id))
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
  const id = Number(values["id"]);
  const assignedRooms = await db
    .select()
    .from(roomTable)
    .where(eq(roomTable.buildingId, id));

  if (assignedRooms.length) {
    return mutate(request.url, {
      message: "Rooms assigned to building",
      level: "failure",
    });
  }

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
