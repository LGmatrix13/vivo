import { sql, eq, asc } from "drizzle-orm";
import { IRD } from "~/models/people";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import { staffTable, buildingTable, zoneTable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function readRDs() {
  const rds = await db
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
    })
    .from(staffTable)
    .leftJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .groupBy(staffTable.id)
    .orderBy(staffTable.lastName, staffTable.firstName);
  return rds;
}

export async function readRDsDropdown() {
  const rds = await db
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
  const rd = values as IRD;
  try {
    await db.insert(staffTable).values(rd);
    return mutate(request.url, {
      message: "RD Created",
      level: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("RD:", rd);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}

export async function updateRD(values: Values, request: Request) {
  const rd = values as IRD;
  try {
    await db.update(staffTable).set(rd).where(eq(staffTable.id, rd.id));
    return mutate(request.url, {
      message: "RD Updated",
      level: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("RD:", rd);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}

export async function deleteRD(values: Values, request: Request) {
  const id = Number(values["id"]);
  try {
    const rasAssigned = await db
      .select()
      .from(zoneTable)
      .where(eq(zoneTable.staffId, id));
    if (rasAssigned.length) {
      return mutate(request.url, {
        message: "RD has assigned RAs",
        level: "failure",
      });
    }

    await db.delete(staffTable).where(eq(staffTable.id, id));

    return mutate(request.url, {
      message: "RD Deleted",
      level: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("RD id:", id);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}
