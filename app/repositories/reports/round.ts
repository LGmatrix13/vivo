import { sql, eq, desc, and } from "drizzle-orm";
import { CreatedRound, Round } from "~/schemas/reports/round";
import { db } from "~/utilties/connection.server";
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

export async function readRoundReports() {
  const data = await db.client
    .select({
      id: roundReportTable.id,
      zoneId: roundReportTable.zoneId,
      submitted: roundReportTable.submitted,
      time: sql<string>`TO_CHAR(${roundReportTable.time}, 'YYYY-MM-DD HH12:MI AM')`.as(
        "formattedTime"
      ),
      description: roundReportTable.description,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
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
    };
  });

  return formattedData;
}

export async function readRoundReportsAsRD(id: number) {
  const data = await db.client
    .select({
      id: roundReportTable.id,
      zoneId: roundReportTable.zoneId,
      submitted: roundReportTable.submitted,
      time: sql<string>`TO_CHAR(${roundReportTable.time}, 'YYYY-MM-DD HH12:MI AM')`.as(
        "formattedTime"
      ),
      description: roundReportTable.description,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
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
    };
  });

  return formattedData;
}

export async function readRoundReportsAsRA(id: number) {
  const data = await db.client
    .select({
      id: roundReportTable.id,
      zoneId: roundReportTable.zoneId,
      submitted: roundReportTable.submitted,
      time: sql<string>`TO_CHAR(${roundReportTable.time}, 'YYYY-MM-DD HH12:MI AM')`.as(
        "formattedTime"
      ),
      description: roundReportTable.description,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
    })
    .from(roundReportTable)
    .innerJoin(zoneTable, eq(roundReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .where(eq(zoneTable.id, id))
    //add inner joins here
    .orderBy(desc(roundReportTable.submitted));

  const formattedData = data.map((round) => {
    return {
      ...round,
      time: formatDate(round.submitted, true),
    };
  });

  return formattedData;
}

export async function createRound(values: Values, request: Request) {
  return db.insert(request, roundReportTable, CreatedRound, values, {
    message: "Round Created",
    level: "success",
  });
}

export async function updateRound(values: Values, request: Request) {
  return db.update(
    request,
    roundReportTable,
    Round,
    values,
    (values) => eq(roundReportTable.id, values.id),
    {
      message: "Round Created",
      level: "success",
    }
  );
}

export async function createReadReport(values: Values, request: Request){
  return db.insert(
    request,
    readTable,
    Round,
    values,
  );
}
