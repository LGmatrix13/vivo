import { buildingTable, consverationReportTable, readTable, residentTable, roomTable, zoneTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { and, eq, sql } from "drizzle-orm";


export async function viewConversationReportInsightsRA() {
    const data = await db.client
        .select({
          id: consverationReportTable.id,
          residentId: consverationReportTable.residentId,
          submitted: consverationReportTable.submitted,
          explanation: consverationReportTable.explanation,
          level: consverationReportTable.level,
          zoneId: consverationReportTable.zoneId,
          sentiment: consverationReportTable.sentiment,
          highPriority: consverationReportTable.highPriority,
          ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
            "raName"
          ),
          read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
            "read"
          ),
          buildingId: buildingTable.id,
        })
        .from(consverationReportTable)
}
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

}

export async function lastConversation(){
  
}
