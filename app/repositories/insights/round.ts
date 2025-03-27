import { roundReportTable, buildingTable } from "~/utilties/schema.server";
import { db } from "~/utilties/postgres.server";
import { eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

function calculateLevelViolation(violations: number) {
  if (violations > 2) {
    return "danger";
  } else if (violations > 1) {
    return "warning";
  } else {
    return "great";
  }
}

function calculateLevelOutstandingWorkOrders(outstandingWorkOrders: number) {
  if (outstandingWorkOrders > 3) {
    return "danger";
  } else if (outstandingWorkOrders > 1) {
    return "warning";
  } else {
    return "great";
  }
}

export async function readRoundReportInsightsViolationsAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${roundReportTable.violations} IS NOT NULL THEN 1 END)`,
    })
    .from(roundReportTable)
    .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id))
    .where(eq(buildingTable.staffId, staffId));

  const { count } = data[0];

  return {
    title: `${count} violations`,
    level: calculateLevelViolation(count),
    href: "/staff/reports/round?hasViolations=true",
  };
}

export async function readRoundReportInsightsOutstandingWorkOrdersAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${roundReportTable.outstandingWorkOrders} IS NOT NULL THEN 1 END)`,
    })
    .from(roundReportTable)
    .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id))
    .where(eq(buildingTable.id, staffId));

  const { count } = data[0];

  return {
    title: `${count} outstanding work orders`,
    level: calculateLevelOutstandingWorkOrders(count),
    href: "/staff/reports/round?hasOutstandingWorkOrders=true",
  };
}

export async function readRoundReportInsightsViolationsAsAdmin() {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${roundReportTable.violations} IS NOT NULL THEN 1 END)::integer`,
    })
    .from(roundReportTable);

  const { count } = data[0];

  return {
    title: `${count} violations`,
    level: calculateLevelViolation(count),
    href: "/staff/reports/round?hasViolations=true",
  };
}

export async function readRoundReportInsightsOutstandingWorkOrdersAsAdmin() {
  const data = await db.client
    .select({
      sum: sql<number>`COUNT(CASE WHEN ${roundReportTable.outstandingWorkOrders} IS NOT NULL THEN 1 END)::integer`,
    })
    .from(roundReportTable);

  const { sum } = data[0];

  return {
    title: `${sum} outstanding work orders`,
    level: calculateLevelOutstandingWorkOrders(sum),
    href: "/staff/reports/round?hasOutstandingWorkOrders=true",
  };
}

export async function readRoundReportInsightsViolationsAsRA(zoneId: number) {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${roundReportTable.violations} IS NOT NULL THEN 1 END)::integer`,
    })
    .from(roundReportTable)
    .where(eq(roundReportTable.zoneId, zoneId));

  const { count } = data[0];

  return {
    title: `${count} violations`,
    level: calculateLevelViolation(count),
    href: "/ra/reports/round?hasViolations=true",
  };
}

export async function readRoundReportInsightsOutstandingWorkOrdersAsRA(
  zoneId: number
) {
  const data = await db.client
    .select({
      sum: sql<number>`COUNT(CASE WHEN ${roundReportTable.outstandingWorkOrders} IS NOT NULL THEN 1 END)::integer`,
    })
    .from(roundReportTable)
    .where(eq(roundReportTable.zoneId, zoneId));

  const { sum } = data[0];

  return {
    title: `${sum} outstanding work orders`,
    level: calculateLevelOutstandingWorkOrders(sum),
    href: "/ra/reports/round?hasOutstandingWorkOrders=true",
  };
}
