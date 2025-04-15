import { eventReportTable, zoneTable } from "~/utilties/schema.server";
import { db } from "~/utilties/postgres.server";
import { eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

/**
 * counts the number of events a specific ra has
 * @returns an insight representing that number
 */
export async function readEventInsightsCountAsRA(
  zoneId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(${eventReportTable.id})`,
    })
    .from(eventReportTable)
    .where(eq(eventReportTable.zoneId, zoneId));

  const { count } = data[0];

  function calculateLevel() {
    if (count >= 3) {
      return "great";
    } else if (count >= 1) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `You have had ${count || 0} events`,
    level: calculateLevel(),

    href: "/ra/reports/event",
  };
}

/**
 * counts the total event attendance for a specific ra
 * @returns an insight representing that number
 */
export async function readEventInsightsAttendanceAsRA(
  zoneId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      sum: sql<number>`SUM(${eventReportTable.attendance})`,
    })
    .from(eventReportTable)
    .where(eq(eventReportTable.zoneId, zoneId));

  const { sum } = data[0];

  function calculateLevel() {
    if (sum >= 10) {
      return "great";
    } else if (sum >= 5) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${sum || 0} total residents have attended your events`,
    level: calculateLevel(),

    href: "/ra/reports/event",
  };
}

/**
 * counts the number of events that are in an RDs building
 * @returns an insight representing that number
 */
export async function readEventInsightsCountAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(${eventReportTable.id})`,
    })
    .from(eventReportTable)
    .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
    .where(eq(zoneTable.staffId, staffId))
    .groupBy(eventReportTable.zoneId);

  const { count } = data[0];

  function calculateLevel() {
    if (count >= 3 * 5) {
      return "great";
    } else if (count >= 1 * 5) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${count || 0} events have occured in your building`,
    level: calculateLevel(),

    href: "/staff/reports/event",
  };
}

/**
 * counts the total event attendance for a specific RDs building
 * @returns an insight representing that number
 */
export async function readEventInsightsAttendanceAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      sum: sql<number>`SUM(${eventReportTable.attendance})`,
    })
    .from(eventReportTable)
    .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
    .where(eq(zoneTable.staffId, staffId))
    .groupBy(eventReportTable.zoneId);

  const { sum } = data[0];

  function calculateLevel() {
    if (sum >= 10 * 5) {
      return "great";
    } else if (sum >= 5 * 5) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${sum || 0} total residents have attended events`,
    level: calculateLevel(),

    href: "/staff/reports/event",
  };
}

/**
 * counts the total events in all buildings
 * @returns an insight representing that number
 */
export async function readEventInsightsCountAsAdmin(): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(${eventReportTable.id})`,
    })
    .from(eventReportTable);

  const { count } = data[0];

  function calculateLevel() {
    if (count >= 3 * 45) {
      return "great";
    } else if (count >= 1 * 45) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${count || 0} events have occured on campus`,
    level: calculateLevel(),

    href: "/staff/reports/event",
  };
}

/**
 * counts the total event attendance for all buildings
 * @returns an insight representing that number
 */
export async function readEventInsightsAttendanceAsAdmin(): Promise<IInsight> {
  const data = await db.client
    .select({
      sum: sql<number>`SUM(${eventReportTable.attendance})`,
    })
    .from(eventReportTable);

  const { sum } = data[0];

  function calculateLevel() {
    if (sum >= 10 * 45) {
      return "great";
    } else if (sum >= 5 * 45) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${sum || 0} total residents have attended events`,
    level: calculateLevel(),
    href: "/staff/reports/event",
  };
}

/**
 * insight for how long its been since an ras last event
 * @returns an insight representing that number
 */
export async function readEventInsightsLastEventAsRA(zoneId: number) {
  const data = await db.client
    .select({
      difference: sql<number>`DATE_PART('day', NOW() - MAX(${eventReportTable.time}))`,
    })
    .from(eventReportTable)
    .where(eq(eventReportTable.zoneId, zoneId));

  const { difference } = data[0];

  function calculateLevel() {
    if (difference < 20) {
      return "great";
    } else if (difference < 40) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${difference || 0} days since your last event`,
    level: calculateLevel(),
    action: {
      title: "Create an Event Report",
      href: "/ra/reports/event",
      action: {
        title: "View Your Events",
        href: "/ra/reports/event",
      },
    },
  };
}
