import { roundReportTable, buildingTable, staffTable } from "~/utilties/schema.server";
import { db } from "~/utilties/postgres.server";
import { eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

/**
 * calculates a danger level based on the number of violations
 * @returns the danger level as a string
 */
function calculateLevelViolation(violations: number) {
  if (violations > 2) {
    return "danger";
  } else if (violations >= 1) {
    return "warning";
  } else {
    return "great";
  }
}

/**
 * calculates a danger level based on the number of outstanding work orders
 * @returns the danger level as a string
 */
function calculateLevelOutstandingWorkOrders(outstandingWorkOrders: number) {
  if (outstandingWorkOrders > 3) {
    return "danger";
  } else if (outstandingWorkOrders >= 1) {
    return "warning";
  } else {
    return "great";
  }
}

/**
 * counts the number of violations on a report bases for a specific RD
 * @returns the insight of this number
 */
export async function readRoundReportInsightsViolationsAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${roundReportTable.violations} IS NOT NULL THEN 1 END)`,
    })
    .from(roundReportTable)
    .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id))
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))

  const { count } = data[0];

  return {
    title: `${count} violations`,
    level: calculateLevelViolation(count),
    href: "/staff/reports/round?hasViolations=true",
  };
}

/**
 * counts the number of outstanding work orders on a report bases for a specific RD
 * @returns the insight of this number
 */
export async function readRoundReportInsightsOutstandingWorkOrdersAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${roundReportTable.outstandingWorkOrders} IS NOT NULL THEN 1 END)`,
    })
    .from(roundReportTable)
    .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id))
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))

  const { count } = data[0];

  return {
    title: `${count} outstanding work orders`,
    level: calculateLevelOutstandingWorkOrders(count),
    href: "/staff/reports/round?hasOutstandingWorkOrders=true",
  };
}

/**
 * counts the number of violations on a report bases for the admin, so all reports
 * @returns the insight of this number
 */
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

/**
 * counts the number of outstanding work orders on a report bases for the admin, so all reports
 * @returns the insight of this number
 */
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

/**
 * counts the number of violations on a report bases for a specific RA
 * @returns the insight of this number
 */
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

/**
 * counts the number of outstanding work orders on a report bases for a specific RA
 * @returns the insight of this number
 */
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
