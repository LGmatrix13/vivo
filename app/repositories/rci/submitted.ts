import { desc, eq, sql, and } from "drizzle-orm";
import { alias, PgSelect } from "drizzle-orm/pg-core";
import { UpdatedSubmittedRCI } from "~/schemas/rcis/submitted";
import { db } from "~/utilties/connection.server";
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

type Values = { [key: string]: any };

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
    .leftJoin(RCITable, eq(RCITable.residentId, residentTable.id)) // Fix: Use RCITable.roomId
    .where(eq(residentTable.id, residentId));

  const rci = data[0];
  return {
    ...rci,
    issues: rci?.issues as Record<string, string> | undefined,
  };
}

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

  const formattedData = data.map((rci) => {
    return {
      ...rci,
      totalIssues: Object.keys(rci.issues).length,
      submitted: formatDate(rci.submitted),
    };
  });
  return formattedData;
}

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

export async function updateSubmittedRCIStatus(
  request: Request,
  values: Values
) {
  if (values && values.status == "CHECKED_OUT") {
    console.log("bruh")
    values.checkedOut = new Date().toISOString()
    console.log(`${values.checkedOut}`)
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
    .where(and(eq(staffTable.id, id),eq(RCITable.status, type)))
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
