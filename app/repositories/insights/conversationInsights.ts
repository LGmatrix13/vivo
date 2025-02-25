import { buildingTable, consverationReportTable, readTable, residentTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { eq, sql } from "drizzle-orm";


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

        //needs filter for when true and by building
        const highPriorityCount = await db.client
        .select({
            highPriorityCount: sql`SUM(${consverationReportTable.highPriority})`
        }).from(consverationReportTable)


}
