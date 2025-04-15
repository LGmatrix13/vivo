import {
  buildingTable,
  consverationReportTable,
  residentTable,
  roomTable,
  zoneTable,
} from "~/utilties/schema.server";
import { db } from "~/utilties/postgres.server";
import { and, eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";

/**
 * 
 * reads how many conversations have taken place in a specific RDs building
 * @returns a insight representing the count of conversations
 */
export async function readConversationInsightsCountAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(${consverationReportTable.id})`,
    })
    .from(consverationReportTable)
    .innerJoin(zoneTable, eq(zoneTable.id, consverationReportTable.zoneId))
    .where(eq(zoneTable.staffId, staffId))

  const { count } = data[0];

  /**
   * calculates the level of concern about the number of conversations
   * @returns a string representing a level of concern
   */
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
    title: `${count || 0} conversations have been logged`,
    level: calculateLevel(),
    href: "/staff/reports/conversation",
  };
}

/**
 * 
 * reads how many high priority conversations have taken place in a specific RDs building
 * @returns a insight representing the count of conversations
 */
export async function readConversationInsightsHighPriorityCountAsRD(
  staffId: number
): Promise<IInsight> {
  const data = await db.client
    .select({
      count: sql<number>`COUNT(CASE WHEN ${consverationReportTable.highPriority} = TRUE THEN 1 END)::integer`,
    })
    .from(consverationReportTable)
    .innerJoin(zoneTable, eq(zoneTable.id, consverationReportTable.zoneId))
    .where(eq(zoneTable.staffId, staffId))
    
  const { count } = data[0];
    /**
   * calculates the level of concern about the number of conversations
   * @returns a string representing a level of concern
   */
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
    title: `${count || 0} high priority conversations`,
    level: calculateLevel(),
    href: "/staff/reports/conversation?highPriority=Yes",
  };
}

/**
 * 
 * reads how many level 3 conversations have taken place in a specific RDs building
 * @returns a insight representing the count of conversations
 */
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
    title: `${count || 0} level 3 conversations`,
    level: "great",
    href: "/staff/reports/conversation?level=3",
  };
}

/**
 * 
 * reads how many conversations have taken place in all buildings
 * @returns a insight representing the count of conversations
 */
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

   /**
   * calculates the level of concern about the number of conversations
   * @returns a string representing a level of concern
   */
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
    title: `${count || 0} conversations have been logged`,
    level: calculateLevel(),
    href: "/staff/reports/conversation",
  };
}

/**
 * 
 * reads how many high priority conversations have taken place in all buildings
 * @returns a insight representing the count of conversations
 */
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

   /**
   * calculates the level of concern about the number of conversations
   * @returns a string representing a level of concern
   */
  function calculateLevel() {
    if (count == 0) {
      return "great";
    } else if (count < 3 * 10) {
      return "warning";
    } else {
      return "danger";
    }
  }

  return {
    title: `${count || 0} high priority conversations`,
    level: calculateLevel(),
    href: "/staff/reports/conversation?highPriority=Yes",
  };
}

/**
 * 
 * reads how many level 3 conversations have taken place in all buildings
 * @returns a insight representing the count of conversations
 */
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
    title: `${count || 0} level 3 conversations`,
    level: "great",
    href: "/staff/reports/conversation?level=3",
  };
}

/**
 * 
 * reads how many late conversations have taken place for a specific RA
 * @returns a insight representing the count of conversations
 */
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
    .groupBy(residentTable.id);

     /**
   * calculates the level of concern about the number of conversations
   * @returns a string representing a level of concern
   */
  function calculateLevel(daysSinceLastConvo: number) {
    if (daysSinceLastConvo > 30) {
      return "danger";
    } else if (daysSinceLastConvo > 14) {
      return "warning";
    } else {
      return "great";
    }
  }

  return data.map(
    (insight) =>
      ({
        title: `${insight.daysSinceLastConvo} days since your last conversation with ${insight.name}`,
        level: calculateLevel(insight.daysSinceLastConvo),
        href: `/ra/reports/conversation?resident=${insight.name}`,
      } as IInsight)
  );
}
