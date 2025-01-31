import { sql, eq, asc } from "drizzle-orm";
import { IRD } from "~/models/people";
import { CreatedRD, RD } from "~/schemas/people/rd";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import { staffTable, buildingTable, zoneTable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

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

export async function createRD(values: Values, request: Request) {
  return db.insert(request, staffTable, CreatedRD, values, true, {
    message: "RD Created",
    level: "success",
  });
}

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
