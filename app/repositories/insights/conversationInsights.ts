import { buildingTable, consverationReportTable, readTable, residentTable, roomTable, zoneTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { and, eq, sql } from "drizzle-orm";



//for RDS and ADMIN based on building ID
export async function conversationInsights(buildingId: number) {
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
            highPriorityCount: sql`SUM(${consverationReportTable.highPriority})`,
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
            level3Count: sql`SUM(${consverationReportTable.level})`,
        }).from(consverationReportTable)
        .innerJoin(residentTable, eq(residentTable.id, consverationReportTable.residentId))
        .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
        .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
        .where(
          and(
              eq(consverationReportTable.level, "3"),
              eq(buildingTable.id, buildingId) // Replace someBuildingId with the actual value
          )
        )

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
