import { db } from "~/utilties/connection.server";
import {
  RCITable,
  residentTable,
  roomTable,
  zoneTable,
} from "~/utilties/schema.server";
import { eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

function calculateLevelCompleteRCI(completeRCIs: number, scale: number) {
  if (completeRCIs > 20 * scale) {
    return "great";
  } else if (completeRCIs > 10 * scale) {
    return "warning";
  } else {
    return "danger";
  }
}

function calculateLevelApprovedRCI(approvedRCIs: number, scale: number) {
  if (approvedRCIs > 25 * scale) {
    return "great";
  } else if (approvedRCIs > 15 * scale) {
    return "warning";
  } else {
    return "danger";
  }
}

function calculateLevelSentToLimble(sentToLimble: number, scale: number) {
  if (sentToLimble > 10 * scale) {
    return "great";
  } else if (sentToLimble > 5 * scale) {
    return "warning";
  } else {
    return "danger";
  }
}
export async function readRCIInsightsAsRA(zoneId: number): Promise<IInsight[]> {
  const data = await db.client
    .select({
      completeRCIs: sql<number>`SUM(CASE WHEN ${RCITable.status} = 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`,
      approvedRCIs: sql<number>`SUM(CASE WHEN ${RCITable.status} = 'APPROVED' THEN 1 ELSE 0 END)::integer`,
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .where(eq(roomTable.zoneId, zoneId))
    .groupBy(residentTable.id);

  const { completeRCIs, approvedRCIs } = data[0];

  return [
    {
      title: `${completeRCIs} completed RCIs`,
      level: calculateLevelCompleteRCI(completeRCIs, 1),
      action: {
        title: "View Complete RCIs",
        href: "/ra/rcis/complete",
      },
    },
    {
      title: `${approvedRCIs} approved RCIs`,
      level: calculateLevelApprovedRCI(approvedRCIs, 1),
    },
  ];
}

export async function readRCIInsightsAsRD(
  staffId: number
): Promise<IInsight[]> {
  const data = await db.client
    .select({
      completeRCIs: sql<number>`SUM(CASE WHEN ${RCITable.status} != 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`,
      approvedRCIs: sql<number>`SUM(CASE WHEN ${RCITable.status} = 'APPROVED' THEN 1 ELSE 0 END)::integer`,
      sentToLimble: sql<number>`SUM(CASE WHEN ${RCITable.status} = 'SENT_TO_LIMBLE' THEN 1 ELSE 0 END)::integer`,
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(roomTable, eq(roomTable.zoneId, zoneTable.id))
    .where(eq(zoneTable.staffId, staffId))
    .groupBy(residentTable.id);

  const { completeRCIs, approvedRCIs, sentToLimble } = data[0];

  return [
    {
      title: `${completeRCIs} completed RCIs`,
      level: calculateLevelCompleteRCI(completeRCIs, 5),
    },
    {
      title: `${approvedRCIs} approved RCIs`,
      level: calculateLevelApprovedRCI(approvedRCIs, 5),
    },

    {
      title: `${approvedRCIs} approved RCIs`,
      level: calculateLevelSentToLimble(sentToLimble, 5),
    },
  ];
}

export async function readRCIInsightsAsAdmin(): Promise<IInsight[]> {
  const data = await db.client
    .select({
      completeRCIs: sql<number>`SUM(CASE WHEN ${RCITable.status} != 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`,
      approvedRCIs: sql<number>`SUM(CASE WHEN ${RCITable.status} = 'APPROVED' THEN 1 ELSE 0 END)::integer`,
      sentToLimble: sql<number>`SUM(CASE WHEN ${RCITable.status} = 'SENT_TO_LIMBLE' THEN 1 ELSE 0 END)::integer`,
    })
    .from(RCITable);

  const { completeRCIs, approvedRCIs, sentToLimble } = data[0];

  return [
    {
      title: `${completeRCIs} completed RCIs`,
      level: calculateLevelCompleteRCI(completeRCIs, 45),
    },
    {
      title: `${approvedRCIs} approved RCIs`,
      level: calculateLevelApprovedRCI(approvedRCIs, 45),
    },

    {
      title: `${approvedRCIs} approved RCIs`,
      level: calculateLevelSentToLimble(sentToLimble, 45),
    },
  ];
}
