import { sql, eq, desc, and } from "drizzle-orm";
import { CreatedWeekly, Weekly } from "~/schemas/reports/weekly";
import { db } from "~/utilties/connection.server";
import { formatDate } from "~/utilties/formatDate";
import {
  buildingTable,
  readTable,
  staffTable,
  weeklyReportTable,
} from "~/utilties/schema.server";
import { residentTable } from "~/utilties/schema.server";
import { zoneTable } from "~/utilties/schema.server";
type Values = { [key: string]: any };

export async function readWeeklyReports() {
  const data = await db.client
    .select({
      id: weeklyReportTable.id,
      zoneId: weeklyReportTable.zoneId,
      submitted: weeklyReportTable.submitted,
      raResponsibilities: weeklyReportTable.raResponsibilities,
      academics: weeklyReportTable.academics,
      spiritualHealth: weeklyReportTable.spiritualHealth,
      mentalHealth: weeklyReportTable.mentalHealth,
      physicalHealth: weeklyReportTable.physicalHealth,
      personalLife: weeklyReportTable.personalLife,
      technologyAndMedia: weeklyReportTable.technologyAndMedia,
      explainChoices: weeklyReportTable.explainChoices,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
    })
    .from(weeklyReportTable)
    .innerJoin(zoneTable, eq(weeklyReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, weeklyReportTable.id),
        eq(readTable.personType, "ADMIN"),
        eq(readTable.reportType, "WEEKLY")
      )
    )
    .orderBy(desc(weeklyReportTable.submitted));

  const formattedStatus = {
    GREAT: "Great",
    GOOD: "Good",
    OK: "Ok",
    ROUGH: "Rough",
    REALLY_ROUGH: "Really Rough",
  };
  const formattedData = data.map((weekly) => {
    return {
      ...weekly,
      submitted: formatDate(weekly.submitted, true),
      raResponsibilities: formattedStatus[weekly.raResponsibilities],
      academics: formattedStatus[weekly.academics],
      spiritualHealth: formattedStatus[weekly.spiritualHealth],
      mentalHealth: formattedStatus[weekly.mentalHealth],
      physicalHealth: formattedStatus[weekly.physicalHealth],
      personalLife: formattedStatus[weekly.personalLife],
      technologyAndMedia: formattedStatus[weekly.technologyAndMedia],
    };
  });

  return formattedData;
}

export async function readWeeklyReportsAsRD(id: number) {
  const data = await db.client
    .select({
      id: weeklyReportTable.id,
      zoneId: weeklyReportTable.zoneId,
      submitted: weeklyReportTable.submitted,
      raResponsibilities: weeklyReportTable.raResponsibilities,
      academics: weeklyReportTable.academics,
      spiritualHealth: weeklyReportTable.spiritualHealth,
      mentalHealth: weeklyReportTable.mentalHealth,
      physicalHealth: weeklyReportTable.physicalHealth,
      personalLife: weeklyReportTable.personalLife,
      technologyAndMedia: weeklyReportTable.technologyAndMedia,
      explainChoices: weeklyReportTable.explainChoices,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
    })
    .from(weeklyReportTable)
    .innerJoin(zoneTable, eq(weeklyReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, weeklyReportTable.id),
        eq(readTable.personType, "STAFF"),
        eq(readTable.reportType, "WEEKLY")
      )
    )
    .where(eq(staffTable.id, id))
    .orderBy(desc(weeklyReportTable.submitted));

  const formattedStatus = {
    GREAT: "Great",
    GOOD: "Good",
    OK: "Ok",
    ROUGH: "Rough",
    REALLY_ROUGH: "Really Rough",
  };
  const formattedData = data.map((weekly) => {
    return {
      ...weekly,
      submitted: formatDate(weekly.submitted, true),
      raResponsibilities: formattedStatus[weekly.raResponsibilities],
      academics: formattedStatus[weekly.academics],
      spiritualHealth: formattedStatus[weekly.spiritualHealth],
      mentalHealth: formattedStatus[weekly.mentalHealth],
      physicalHealth: formattedStatus[weekly.physicalHealth],
      personalLife: formattedStatus[weekly.personalLife],
      technologyAndMedia: formattedStatus[weekly.technologyAndMedia],
    };
  });

  return formattedData;
}

export async function readWeeklyReportsAsRA(id: number) {
  const data = await db.client
    .select({
      id: weeklyReportTable.id,
      zoneId: weeklyReportTable.zoneId,
      submitted: weeklyReportTable.submitted,
      raResponsibilities: weeklyReportTable.raResponsibilities,
      academics: weeklyReportTable.academics,
      spiritualHealth: weeklyReportTable.spiritualHealth,
      mentalHealth: weeklyReportTable.mentalHealth,
      physicalHealth: weeklyReportTable.physicalHealth,
      personalLife: weeklyReportTable.personalLife,
      technologyAndMedia: weeklyReportTable.technologyAndMedia,
      explainChoices: weeklyReportTable.explainChoices,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
    })
    .from(weeklyReportTable)
    .innerJoin(zoneTable, eq(weeklyReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .where(eq(zoneTable.id, id))
    .orderBy(desc(weeklyReportTable.submitted));

  const formattedStatus = {
    GREAT: "Great",
    GOOD: "Good",
    OK: "Ok",
    ROUGH: "Rough",
    REALLY_ROUGH: "Really Rough",
  };
  const formattedData = data.map((weekly) => {
    return {
      ...weekly,
      submitted: formatDate(weekly.submitted, true),
      raResponsibilities: formattedStatus[weekly.raResponsibilities],
      academics: formattedStatus[weekly.academics],
      spiritualHealth: formattedStatus[weekly.spiritualHealth],
      mentalHealth: formattedStatus[weekly.mentalHealth],
      physicalHealth: formattedStatus[weekly.physicalHealth],
      personalLife: formattedStatus[weekly.personalLife],
      technologyAndMedia: formattedStatus[weekly.technologyAndMedia],
    };
  });

  return formattedData;
}

export async function createWeekly(values: Values, request: Request) {
  return await db.insert(
    request,
    weeklyReportTable,
    CreatedWeekly,
    values,
    true,
    {
      message: "Weekly Created",
      level: "success",
    }
  );
}

export async function updateWeekly(values: Values, request: Request) {
  return db.update(
    request,
    weeklyReportTable,
    Weekly,
    values,
    (values) => eq(weeklyReportTable.id, values.id),
    {
      message: "Weekly Updated",
      level: "success",
    }
  );
}
