import { zoneTable, staffTable, buildingTable, residentTable, readTable, weeklyReportTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { and, eq, sql } from "drizzle-orm";
import { formatDate } from "~/utilties/formatDate";

export async function viewHealthInsightsAsRA() {
    const data = await db.client
        .select({
            id: weeklyReportTable.id,
            residentId: weeklyReportTable.zoneId,
            submitted: weeklyReportTable.submittedOn,
            explanation: weeklyReportTable.explainChoices,
            zoneId: weeklyReportTable.zoneId,
            highPriority: weeklyReportTable.mentalHealth,
            ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as("raName"),
            read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as("read"),
            buildingId: buildingTable.id,
            raResponsabilities: weeklyReportTable.raResponsibilities,
            academics: weeklyReportTable.academics,
            spiritualHealth: weeklyReportTable.spiritualHealth,
            physicalHealth: weeklyReportTable.physicalHealth,
            personalLife: weeklyReportTable.personalLife,
            technologyAndMedia: weeklyReportTable.technologyAndMedia,
        })
        .from(weeklyReportTable)
        .orderBy(weeklyReportTable.submittedOn);

    const formattedData = data.map((event) => {
        return {
            ...event,
            time: formatDate(event.submitted, true),
        };
    });

    return formattedData;
}

export async function viewHealthInsights() {
    const data = await db.client
        .select({
            ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as("raName"),
            //buildingId: buildingTable.id,
            mentalHealth: weeklyReportTable.mentalHealth,
            raResponsabilities: weeklyReportTable.raResponsibilities,
            academics: weeklyReportTable.academics,
            spiritualHealth: weeklyReportTable.spiritualHealth,
            physicalHealth: weeklyReportTable.physicalHealth,
            personalLife: weeklyReportTable.personalLife,
            technologyAndMedia: weeklyReportTable.technologyAndMedia,
        })
        .from(weeklyReportTable)
        .orderBy(weeklyReportTable.submittedOn);

    return data;
}
