import { desc, eq, sql, and, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { UpdatedSubmittedRCI } from "~/schemas/rcis/submitted";
import { db } from "~/utilties/postgres.server";
import { formatDate } from "~/utilties/formatDate";
import {
  buildingTable,
  LimbleTable,
  RCITable,
  readTable,
  residentTable,
  roomTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";
import mutate from "~/utilties/mutate.server";

type Values = { [key: string]: any };

/**
 * Gets the submitted RCIs on a given RA's hall
 */
export async function readSubmittedRCIAsRA(zoneId: number) {
  const data = await db.client
    .select({
      id: RCITable.id,
      roomType: roomTable.roomType,
      roomId: roomTable.id,
      issues: RCITable.issues,
    })
    .from(roomTable)
    .innerJoin(residentTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(zoneTable, eq(zoneTable.residentId, residentTable.id))
    .leftJoin(RCITable, eq(roomTable.id, residentTable.roomId))
    .where(eq(zoneTable.id, zoneId));

  const rci = data[0];
  return {
    ...rci,
    issues: rci.issues as Record<string, string> | undefined,
  };
}

/**
 * Gets the submitted RCI for a given resident
 */
export async function readSubmittedRCI(residentId: number) {
  const data = await db.client
    .select({
      id: RCITable.id,
      roomType: roomTable.roomType,
      roomId: roomTable.id,
      issues: RCITable.issues,
      status: RCITable.status,
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(RCITable, eq(RCITable.residentId, residentTable.id))
    .where(eq(residentTable.id, residentId));

  const rci = data[0];
  return {
    ...rci,
    issues: rci?.issues as Record<string, string> | undefined,
  };
}

/**
 * Gets the submitted RCIs for all residents
 */
export async function readSubmittedRCIsAsAdmin(type: "ACTIVE" | "CHECKED_OUT") {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const data = await db.client
    .select({
      id: RCITable.id,
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      roomId: roomTable.id,
      building: buildingTable.name,
      submitted: RCITable.submitted,
      status: RCITable.status,
      buildingId: buildingTable.id,
      issues: sql<Record<string, string>>`${RCITable.issues}`,
      roomType: roomTable.roomType,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(residentTable.id, RCITable.residentId))
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .innerJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, RCITable.id),
        eq(readTable.personType, "ADMIN"),
        eq(readTable.reportType, `RCI_${type}`)
      )
    )
    .where(eq(RCITable.status, type))
    .orderBy(desc(RCITable.id));

  const formattedData = data.map((rci) => {
    return {
      ...rci,
      totalIssues: Object.keys(rci.issues).length,
      submitted: formatDate(rci.submitted),
    };
  });
  return formattedData;
}

/**
 * Gets the active RCIs on a given RA's hall
 */
export async function readActiveRCIsAsRA(zoneId: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const data = await db.client
    .select({
      id: RCITable.id,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      building: buildingTable.name,
      submitted: RCITable.submitted,
      status: RCITable.status,
      buildingId: buildingTable.id,
      roomId: roomTable.id,
      issues: sql<Record<string, string>>`${RCITable.issues}`,
      roomType: roomTable.roomType,
      limbleWorkOrderId: LimbleTable.workOrderId,
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(residentTable.id, RCITable.residentId))
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .innerJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(LimbleTable, eq(LimbleTable.roomId, roomTable.id))
    .where(and(eq(zoneTable.id, zoneId), eq(RCITable.status, "ACTIVE")))
    .orderBy(desc(RCITable.id));

  console.log(data);

  const formattedData = data.map((rci) => {
    return {
      ...rci,
      totalIssues: Object.keys(rci.issues).length,
      submitted: formatDate(rci.submitted),
    };
  });
  return formattedData;
}

/**
 * Gets the submitted RCIs on a given RA's hall
 */
export async function readSubmittedRCIsAsRA(
  zoneId: number,
  status: "AWAITING_RA" | "ACTIVE" | "RA_CHECKOUT"
) {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const data = await db.client
    .select({
      id: RCITable.id,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      building: buildingTable.name,
      submitted: RCITable.submitted,
      status: RCITable.status,
      buildingId: buildingTable.id,
      issues: sql<Record<string, string>>`${RCITable.issues}`,
      roomType: roomTable.roomType,
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(residentTable.id, RCITable.residentId))
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .innerJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .where(and(eq(zoneTable.id, zoneId), eq(RCITable.status, status)))
    .orderBy(desc(RCITable.id));

  const formattedData = data.map((rci) => {
    return {
      ...rci,
      totalIssues: Object.keys(rci.issues).length,
      submitted: formatDate(rci.submitted),
    };
  });
  return formattedData;
}

/**
 * Updates an RCI's status
 */
export async function updateSubmittedRCIStatus(
  request: Request,
  values: Values
) {
  if (values && values.status == "CHECKED_OUT") {
    values.checkedOut = new Date().toISOString();
  }
  return db.update(
    request,
    RCITable,
    UpdatedSubmittedRCI,
    values,
    (values) => eq(RCITable.id, values.id),
    {
      message: "Updated RCI",
      level: "success",
    }
  );
}

/**
 * Gets the submitted RCIs on in given RD's building
 */
export async function readSubmittedRCIsAsRD(
  id: number,
  type: "ACTIVE" | "CHECKED_OUT"
) {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const data = await db.client
    .select({
      id: RCITable.id,
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      building: buildingTable.name,
      status: RCITable.status,
      buildingId: buildingTable.id,
      issues: sql<Record<string, string>>`${RCITable.issues}`,
      submitted: RCITable.submitted,
      roomType: roomTable.roomType,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(residentTable.id, RCITable.residentId))
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .innerJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .innerJoin(staffTable, eq(staffTable.id, buildingTable.staffId))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, RCITable.id),
        eq(readTable.personType, "STAFF"),
        eq(readTable.reportType, `RCI_${type}`)
      )
    )
    .where(and(eq(staffTable.id, id), eq(RCITable.status, type)))
    .orderBy(desc(RCITable.id));

  const formattedData = data.map((rci) => {
    return {
      ...rci,
      totalIssues: Object.keys(rci.issues).length,
      submitted: formatDate(rci.submitted),
    };
  });
  return formattedData;
}

/**
 * Releases all currently active RCIs within the Admin/RD's scope for checkout
 */
export async function releaseRCIsForCheckout(request: Request, values: Values) {
  const rciIds = JSON.parse(values.ids as string) as number[];
  await db.client
    .update(RCITable)
    .set({
      status: "RESIDENT_CHECKOUT",
    })
    .where(inArray(RCITable.id, rciIds));

  return mutate(request.url, {
    message: "Released RCIs for Checkout",
    level: "success",
  });
}
