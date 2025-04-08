import { sql, eq, desc, and } from "drizzle-orm";
import { CreatedRound, UpdatedRound } from "~/schemas/reports/round";
import { db } from "~/utilties/postgres.server";
import { formatDate } from "~/utilties/formatDate";
import {
  buildingTable,
  staffTable,
  roundReportTable,
  readTable,
} from "~/utilties/schema.server";
import { residentTable } from "~/utilties/schema.server";
import { zoneTable } from "~/utilties/schema.server";
type Values = { [key: string]: any };

/**
 * Reads the round reports submitted by all RAs
 */
export async function readRoundReports() {
  const data = await db.client
    .select({
      id: roundReportTable.id,
      zoneId: roundReportTable.zoneId,
      submitted: roundReportTable.submitted,
      time: roundReportTable.time,
      description: roundReportTable.description,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
      violations: roundReportTable.violations,
      outstandingWorkOrders: roundReportTable.outstandingWorkOrders,
    })
    .from(roundReportTable)
    .innerJoin(zoneTable, eq(roundReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, roundReportTable.id),
        eq(readTable.personType, "ADMIN"),
        eq(readTable.reportType, "ROUND")
      )
    )
    .orderBy(desc(roundReportTable.submitted));

  const formattedData = data.map((round) => {
    return {
      ...round,
      time: formatDate(round.submitted, true),
      hasViolations: !!round.violations,
      hasOutstandingWorkOrders: !!round.outstandingWorkOrders,
    };
  });

  console.log("tes", formattedData);

  return formattedData;
}

/**
 * Reads the round reports submitted by all RAs that work for a given RD
 */
export async function readRoundReportsAsRD(id: number) {
  const data = await db.client
    .select({
      id: roundReportTable.id,
      zoneId: roundReportTable.zoneId,
      submitted: roundReportTable.submitted,
      time: roundReportTable.time,
      description: roundReportTable.description,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
      violations: roundReportTable.violations,
      outstandingWorkOrders: roundReportTable.outstandingWorkOrders,
    })
    .from(roundReportTable)
    .innerJoin(zoneTable, eq(roundReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .where(eq(staffTable.id, id))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, roundReportTable.id),
        eq(readTable.personType, "STAFF"),
        eq(readTable.reportType, "ROUND")
      )
    )
    .orderBy(desc(roundReportTable.submitted));

  const formattedData = data.map((round) => {
    return {
      ...round,
      time: formatDate(round.submitted, true),
      hasViolations: !!round.violations,
      hasOutstandingWorkOrders: !!round.outstandingWorkOrders,
    };
  });

  return formattedData;
}

/**
 * Reads the round reports submitted by a given RA
 */
export async function readRoundReportsAsRA(id: number) {
  const data = await db.client
    .select({
      id: roundReportTable.id,
      zoneId: roundReportTable.zoneId,
      submitted: roundReportTable.submitted,
      time: roundReportTable.time,
      description: roundReportTable.description,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      violations: roundReportTable.violations,
      outstandingWorkOrders: roundReportTable.outstandingWorkOrders,
    })
    .from(roundReportTable)
    .innerJoin(zoneTable, eq(roundReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .where(eq(zoneTable.id, id))
    .orderBy(desc(roundReportTable.submitted));

  const formattedData = data.map((round) => {
    return {
      ...round,
      time: formatDate(round.submitted, true),
      hasViolations: !!round.violations,
      hasOutstandingWorkOrders: !!round.outstandingWorkOrders,
    };
  });

  return formattedData;
}

/**
 * Creates a new round report in the database
 */
export async function createRound(values: Values, request: Request) {
  return await db.insert(
    request,
    roundReportTable,
    CreatedRound,
    values,
    true,
    {
      message: "Round Created",
      level: "success",
    }
  );
}

/**
 * Updates a round report in the database
 */
export async function updateRound(values: Values, request: Request) {
  return db.update(
    request,
    roundReportTable,
    UpdatedRound,
    values,
    (values) => eq(roundReportTable.id, values.id),
    {
      message: "Round Created",
      level: "success",
    }
  );
}

/**
 * Deletes a round report from the database
 */
export async function deleteRound(values: Values, request: Request) {
  return db.delete(
    request,
    roundReportTable,
    values,
    (id) => eq(roundReportTable.id, id),
    {
      message: "Round Deleted",
      level: "success",
    }
  );
}
