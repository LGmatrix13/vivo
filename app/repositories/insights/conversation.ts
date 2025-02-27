import {
  buildingTable,
  consverationReportTable,
  residentTable,
  roomTable,
} from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { and, eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

export async function readConversationInsightsCountAsRD(
  buildingId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(consverationReportTable)
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    )
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .where(
      eq(buildingTable.id, buildingId) // Replace someBuildingId with the actual value
    );

  const { count } = data[0];

  function calculateLevel() {
    if (count > 10 * 5) {
      return "great";
    } else if (count > 5 * 5) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${count} conversations have been logged`,
    level: calculateLevel(),
  };
}

export async function readConversationInsightsHighPriorityCountAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${consverationReportTable.highPriority} THEN 1 END)::integer`,
    })
    .from(consverationReportTable)
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    )
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .where(
      and(
        eq(consverationReportTable.highPriority, true),
        eq(buildingTable.staffId, staffId)
      )
    );

  const { count } = data[0];
  function calculateLevel() {
    if (count == 0) {
      return "great";
    } else if (count < 3 * 5) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${count} high priority conversations`,
    level: calculateLevel(),
  };
}

export async function readConversationInsightsLevelThreeCountAsRD(
  buildingId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${consverationReportTable.level} = '3' THEN 1 END)::integer`,
    })
    .from(consverationReportTable)
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    )
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .where(
      and(
        eq(consverationReportTable.level, "3"),
        eq(buildingTable.id, buildingId) // Replace someBuildingId with the actual value
      )
    );

  const { count } = data[0];

  return {
    title: `${count} level 3 conversations`,
    level: "great",
    action: {
      title: "View Your Buildings Conversations",
      href: "/staff/reports/conversation",
    },
  };
}

export async function readConversationInsightsCountAsAdmin(): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(consverationReportTable)
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    )
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId));

  const { count } = data[0];

  function calculateLevel() {
    if (count > 10 * 45) {
      return "great";
    } else if (count > 5 * 45) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${count} conversations have been logged`,
    level: calculateLevel(),
  };
}

export async function readConversationInsightsHighPriorityCountAsAdmin(): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${consverationReportTable.highPriority} THEN 1 END)::integer`,
    })
    .from(consverationReportTable)
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    )
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .where(eq(consverationReportTable.highPriority, true));

  const { count } = data[0];

  function calculateLevel() {
    if (count == 0) {
      return "great";
    } else if (count < 3 * 5) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${count} high priority conversations`,
    level: calculateLevel(),
  };
}

export async function readConversationInsightsLevelThreeAsAdmin(): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${consverationReportTable.level} = '3' THEN 1 END)::integer`,
    })
    .from(consverationReportTable)
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    )
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .where(eq(consverationReportTable.level, "3"));

  const { count } = data[0];

  return {
    title: `${count} level 3 conversations`,
    level: "great",
  };
}

export async function readConversationInsightsLastConversatonsAsRA(
  zoneId: number
): Promise<IInsight[]> {
  const data = await db.client
    .select({
      name: sql<string>`CONCAT(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      daysSinceLastConvo: sql<number>`DATE_PART('day', NOW() - MAX(${consverationReportTable.submitted}))`,
    })
    .from(consverationReportTable)
    .innerJoin(
      residentTable,
      eq(consverationReportTable.residentId, residentTable.id)
    )
    .where(eq(consverationReportTable.zoneId, zoneId))
    .groupBy(residentTable.id)
    .having(
      sql`DATE_PART('day', NOW() - MAX(${consverationReportTable.submitted})) > 30`
    );

  function calculateLevel(daysSinceLastConvo: number) {
    if (daysSinceLastConvo > 40) {
      return "danger";
    } else {
      return "warning";
    }
  }

  return data.map(
    (insight) =>
      ({
        title: `${insight.daysSinceLastConvo} days since your last conversation with ${insight.name}`,
        level: calculateLevel(insight.daysSinceLastConvo),
        action: {
          title: "Create a Conversation",
          href: "/ra/reports/conversation",
        },
      } as IInsight)
  );
}
