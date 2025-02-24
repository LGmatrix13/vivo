import { roundReportTable, readTable, buildingTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { and, eq, sql } from "drizzle-orm";
import { formatDate } from "~/utilties/formatDate";

export async function viewRoundReportInsights() {
    const data = await db.client
        .select({
            id: roundReportTable.id,
            zoneId: roundReportTable.zoneId,
            submitted: roundReportTable.submitted,
            description: roundReportTable.description,
            violations: roundReportTable.violations,
            outstandingWorkOrders: roundReportTable.outstandingWorkOrders,
            read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as("read"),
            buildingId: buildingTable.id,
        })
        .from(roundReportTable)
        .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id))
        .orderBy(roundReportTable.submitted);

    const formattedData = data.map((event) => {
        return {
            ...event,
            time: formatDate(event.submitted, true),
        };
    });

    return formattedData;
}
