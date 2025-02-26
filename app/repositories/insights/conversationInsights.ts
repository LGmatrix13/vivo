import { buildingTable, consverationReportTable, readTable, residentTable, roomTable, zoneTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { and, eq, sql } from "drizzle-orm";
import { IInsight } from "~/models/insights";



//for RDS
export async function conversationInsightsAsRD(buildingId: number) {
    //filter by building
    const conversationCount = await db.client
        .select({
            conversationCount: sql`COUNT(*)`.mapWith(Number).as('conversationCount')
        }).from(consverationReportTable)
        .innerJoin(residentTable, eq(residentTable.id, consverationReportTable.residentId))
        .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
        .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
        .where(
              eq(buildingTable.id, buildingId) // Replace someBuildingId with the actual value
        )


        const highPriorityCount = await db.client
        .select({
            highPriorityCount: sql`SUM(CASE WHEN ${consverationReportTable.highPriority} THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("highPriorityCount"),
        }).from(consverationReportTable)
        .innerJoin(residentTable, eq(residentTable.id, consverationReportTable.residentId))
        .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
        .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
        .where(
          and(
              eq(consverationReportTable.highPriority, true),
              eq(buildingTable.id, buildingId) // Replace someBuildingId with the actual value
          )
        )

        const level3Count = await db.client
        .select({
            level3Count: sql`SUM(CASE WHEN ${consverationReportTable.level} = '3' THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("level3Count"),
        }).from(consverationReportTable)
        .innerJoin(residentTable, eq(residentTable.id, consverationReportTable.residentId))
        .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
        .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
        .where(
          and(
              eq(consverationReportTable.level, '3'),
              eq(buildingTable.id, buildingId) // Replace someBuildingId with the actual value
          )
        )

  return {
    conversationCount: conversationCount[0]?.conversationCount || 0,
    highPriorityCount: highPriorityCount[0]?.highPriorityCount || 0,
    level3Count: level3Count[0]?.level3Count || 0
  };

}

export async function conversationInsightsAsADMIN() {
  //filter by building
  const conversationCount = await db.client
      .select({
          conversationCount: sql`COUNT(*)`.mapWith(Number).as('conversationCount')
      }).from(consverationReportTable)
      .innerJoin(residentTable, eq(residentTable.id, consverationReportTable.residentId))
      .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
      .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))


      const highPriorityCount = await db.client
      .select({
          highPriorityCount: sql`SUM(CASE WHEN ${consverationReportTable.highPriority} THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("highPriorityCount"),
      }).from(consverationReportTable)
      .innerJoin(residentTable, eq(residentTable.id, consverationReportTable.residentId))
      .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
      .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
      .where(eq(consverationReportTable.highPriority, true))

      const level3Count = await db.client
      .select({
          level3Count: sql`SUM(CASE WHEN ${consverationReportTable.level} = '3' THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("level3Count"),
      }).from(consverationReportTable)
      .innerJoin(residentTable, eq(residentTable.id, consverationReportTable.residentId))
      .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
      .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
      .where(eq(consverationReportTable.level, '3'))

return {
  conversationCount: conversationCount[0]?.conversationCount || 0,
  highPriorityCount: highPriorityCount[0]?.highPriorityCount || 0,
  level3Count: level3Count[0]?.level3Count || 0
};

}


//FOR RAS ONLY AT THIS TIME
export async function lastConversation(zoneId: number){
    const data = await db.client
      .select({
          firstName: residentTable.firstName,
          lastName: residentTable.lastName,
          daysSinceLastConvo: sql`DATE_PART('day', NOW() - MAX(${consverationReportTable.submitted}))`
      })
      .from(consverationReportTable)
      .innerJoin(residentTable, eq(consverationReportTable.residentId, residentTable.id))
      .where(eq(consverationReportTable.zoneId, zoneId))
      .groupBy(residentTable.id)
      .having(sql`DATE_PART('day', NOW() - MAX(${consverationReportTable.submitted})) > 30`);


      return data
}

export async function formatConvoInsight(insight: { conversationCount: number; highPriorityCount: number; level3Count: any; }){
  
 return {
    category: `Conversations`,
    insights: [
      {
        level: insight.conversationCount > 10 ? "great" as "great" : insight.conversationCount > 5 ? "warning" as "warning" : "danger" as "danger", // You can set the level dynamically based on data conditions
        title: `Total Conversations: ${insight.conversationCount}`,
      },
      {
        level: insight.highPriorityCount == 0 ? "great" as "great" : insight.highPriorityCount < 3 ? "warning" as "warning": "danger" as "danger", // You can set the level dynamically based on data conditions
        title: `High Priority Conversations: ${insight.highPriorityCount}`,
      },
      {
        level: "warning" as "warning", // You can set the level dynamically based on data conditions
        title: `Total Level 3 Conversations: ${insight.level3Count}`,
      },
    ],
  };
}
