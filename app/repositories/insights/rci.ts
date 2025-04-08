import { db } from "~/utilties/postgres.server";
import {
  RCITable,
  residentTable,
  roomTable,
  zoneTable,
} from "~/utilties/schema.server";
import { eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

/**
 * calculates a danger level based on RCI approval numbers
 * @returns a string representation of a danger level
 */
function calculateLevelCompleteRCI(needsApprovedRCI: number, scale: number) {
  if (needsApprovedRCI > 20 * scale) {
    return "danger";
  } else if (needsApprovedRCI > 10 * scale) {
    return "warning";
  } else {
    return "great";
  }
}

/**
 * calculates a danger level based on RCI approval numbers
 * @returns a string representation of a danger level
 */
function calculateLevelApprovedRCI(approvedRCIs: number, scale: number) {
  if (approvedRCIs > 25 * scale) {
    return "great";
  } else if (approvedRCIs > 15 * scale) {
    return "warning";
  } else {
    return "danger";
  }
}

/**
 * creates insights for completed and approved RCIs for a given ra
 * @returns a list of those insights
 */
export async function readRCIInsightsAsRA(zoneId: number): Promise<IInsight[]> {
  const data = await db.client
    .select({
      completeRCIs: sql<number>`COUNT(CASE WHEN ${RCITable.status} = 'AWAITING_RA' THEN 1 END)::integer`,
      approvedRCIs: sql<number>`COUNT(CASE WHEN ${RCITable.status} = 'ACTIVE' THEN 1 END)::integer`,
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .where(eq(roomTable.zoneId, zoneId));
  const { completeRCIs, approvedRCIs } = data[0];

  return [
    {
      title: `${completeRCIs} RCIs waiting for RA approval`,
      level: calculateLevelCompleteRCI(completeRCIs, 1),
      href: `/ra/rcis/approve-check-in`,
    },
    {
      title: `${approvedRCIs} approved RCIs`,
      level: calculateLevelApprovedRCI(approvedRCIs, 1),
      href: `/ra/rcis/approve-check-in`,
    },
  ];
}

/**
 * creates insights for completed and approved RCIs for a given rd
 * @returns a list of those insights
 */
export async function readRCIInsightsAsRD(
  staffId: number
): Promise<IInsight[]> {
  const data = await db.client
    .select({
      completeRCIs: sql<number>`COUNT(CASE WHEN ${RCITable.status} = 'AWAITING_RA' THEN 1 END)::integer`,
      approvedRCIs: sql<number>`COUNT(CASE WHEN ${RCITable.status} = 'ACTIVE' THEN 1 END)::integer`,
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(zoneTable, eq(zoneTable.id, roomTable.zoneId))
    .where(eq(zoneTable.staffId, staffId));

  const { completeRCIs, approvedRCIs } = data[0];

  return [
    {
      title: `${completeRCIs} RCIs waiting for RA approval`,
      level: calculateLevelCompleteRCI(completeRCIs, 5),
      href: `/staff/housing/rcis/active`,
    },
    {
      title: `${approvedRCIs} approved RCIs`,
      level: calculateLevelApprovedRCI(approvedRCIs, 5),
      href: `/staff/housing/rcis/active`,
    },
  ];
}

/**
 * creates insights for completed and approved RCIs for the admin, so all RCIs
 * @returns a list of those insights
 */
export async function readRCIInsightsAsAdmin(): Promise<IInsight[]> {
  const data = await db.client
    .select({
      completeRCIs: sql<number>`COUNT(CASE WHEN ${RCITable.status} = 'AWAITING_RA' THEN 1 END)::integer`,
      approvedRCIs: sql<number>`COUNT(CASE WHEN ${RCITable.status} = 'ACTIVE' THEN 1 END)::integer`,
    })
    .from(RCITable);

  const { completeRCIs, approvedRCIs } = data[0];

  return [
    {
      title: `${completeRCIs} RCIs waiting for RA approval`,
      level: calculateLevelCompleteRCI(completeRCIs, 45),
      href: `/staff/housing/rcis/active`,
    },
    {
      title: `${approvedRCIs} approved RCIs`,
      level: calculateLevelApprovedRCI(approvedRCIs, 45),
      href: `/staff/housing/rcis/active`,
    },
  ];
}
