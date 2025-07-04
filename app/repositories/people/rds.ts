import { sql, eq, asc } from "drizzle-orm";
import { CreatedRD, RD } from "~/schemas/people/rd";
import { db } from "~/utilties/postgres.server";
import mutate from "~/utilties/mutate.server";
import { staffTable, buildingTable, zoneTable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

/**
 * reads rds from the database
 * @returns a list of those rds
 */
export async function readRDs() {
  const rds = await db.client
    .select({
      id: staffTable.id,
      firstName: staffTable.firstName,
      lastName: staffTable.lastName,
      fullName:
        sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
          "fullName"
        ),
      emailAddress: staffTable.emailAddress,
      mailbox: staffTable.mailbox,
      buildings:
        sql<string>`STRING_AGG(${buildingTable.name}, ', ' ORDER BY ${buildingTable.name})`.as(
          "buildings"
        ),
      gender: staffTable.gender,
    })
    .from(staffTable)
    .leftJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .groupBy(staffTable.id)
    .orderBy(staffTable.lastName, staffTable.firstName);
  return rds;
}

/**
 * reads rds from the database using their names to make a dropdown
 * @returns a list of rds
 */
export async function readRDsDropdown() {
  const rds = await db.client
    .select({
      id: staffTable.id,
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
    })
    .from(staffTable)
    .orderBy(asc(staffTable.lastName));

  return rds;
}

/**
 * creates a new rd in the database
 * @returns whether or not creation was a success or not
 */
export async function createRD(values: Values, request: Request) {
  return db.insert(request, staffTable, CreatedRD, values, true, {
    message: "RD Created",
    level: "success",
  });
}

/**
 * updates a rd in the database
 * @returns whether or not updating was a success or not
 */
export async function updateRD(values: Values, request: Request) {
  return db.update(
    request,
    staffTable,
    RD,
    values,
    (values) => eq(staffTable.id, values.id),
    {
      message: "RD Updated",
      level: "success",
    }
  );
}

/**
 * deletes a rd in the database
 * @returns whether or not deletion was a success or not
 */
export async function deleteRD(values: Values, request: Request) {
  const id = Number(values["id"]);
  const rasAssigned = await db.client
    .select()
    .from(zoneTable)
    .where(eq(zoneTable.staffId, id));

  if (rasAssigned.length) {
    return mutate(request.url, {
      message: "RD has assigned RAs",
      level: "failure",
    });
  }

  const buildingsAssigned = await db.client
    .select()
    .from(buildingTable)
    .where(eq(buildingTable.staffId, id));

  if (buildingsAssigned.length) {
    return mutate(request.url, {
      message: "RD has assigned buildings",
      level: "failure",
    });
  }

  await db.client.delete(staffTable).where(eq(staffTable.id, id));

  return mutate(request.url, {
    message: "RD Deleted",
    level: "success",
  });
}
