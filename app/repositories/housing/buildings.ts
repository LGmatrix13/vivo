import { sql, eq, asc, count } from "drizzle-orm";
import { Building, CreatedBuiling } from "~/schemas/housing/building";
import { db } from "~/utilties/postgres.server";
import mutate from "~/utilties/mutate.server";
import {
  buildingTable,
  roomTable,
  staffTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

/**
 * This function reads the buildings from the buildingTable in the database with the attributes
 * selected in the .select statement
 * @returns a list of buildings with the specified attributes
 */
export async function readBuildings() {
  const buildings = await db.client
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


/**
 * selects buildings by there id and name for the dropdown in the UI. The admin version of this function
 * includes all buildings.
 * @returns a list of buildings with the specified attributes
 */
export async function readBuildingsDropdownAsAdmin() {
  const buildings = await db.client
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
    })
    .from(buildingTable)
    .orderBy(asc(buildingTable.name));
  return buildings;
}

/**
 * selects buildings by there id and name for the dropdown in the UI. The RD version of this function
 * selects buildings based on the users ID.
 * @returns a list of buildings with the specified attributes
 */
export async function readBuildingsDropdownAsRD(id: number) {
  const buildings = await db.client
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

/**
 * This function creates an insert request to the db to insert a new building into the buildingTable
 * in the database
 * @returns a message as to whether or not the insert was a success or failure
 */
export async function createBuilding(values: Values, request: Request) {
  return await db.insert(
    request,
    buildingTable,
    CreatedBuiling,
    values,
    undefined,
    {
      message: "Created Building",
      level: "success",
    }
  );
}

/**
 * This function creates an delete request to the db to delete the given building from the buildingTable
 * in the database
 * @returns a message as to whether or not the delete was a success or failure
 */
export async function deleteBuilding(values: Values, request: Request) {
  const id = Number(values["id"]);
  const assignedRooms = await db.client
    .select()
    .from(roomTable)
    .where(eq(roomTable.buildingId, id));

  if (assignedRooms.length) {
    return mutate(request.url, {
      message: "Rooms assigned to building",
      level: "failure",
    });
  }

  await db.client
    .delete(buildingTable)
    .where(eq(buildingTable.id, Number(values["id"])));
  return mutate(request.url, {
    message: "Building Deleted",
    level: "success",
  });
}

/**
 * This function creates an update request to the db to update a building in the buildingTable
 * in the database
 * @returns a message as to whether or not the update was a success or failure
 */
export async function updateBuilding(values: Values, request: Request) {
  return db.update(
    request,
    buildingTable,
    Building,
    values,
    (values) => eq(buildingTable.id, values.id),
    {
      message: "Building Updated",
      level: "success",
    }
  );
}
