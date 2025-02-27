import { eventReportTable, residentTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { eq, sql } from "drizzle-orm";


export async function eventInsightsAsRA(zoneId: number) {
    const eventDataRA = await db.client
        .select({
            eventCount: sql`COUNT(${eventReportTable.zoneId})`,
            totalAttendance: sql`SUM(${eventReportTable.attendance})`,
        })
        .from(eventReportTable)
        .where(eq(eventReportTable.zoneId, zoneId));

    return eventDataRA;
}

export async function eventInsightsAsRD(buildingId: number) {
    const eventDataRD = await db.client
        .select({
            id: eventReportTable.id,
            attendance: eventReportTable.attendance,
        })
        .from(eventReportTable)
        .where(eq(eventReportTable.id, buildingId));

    return eventDataRD;
}

export async function eventInsightsAsADMIN() {
    const eventDataADMIN = await db.client
        .select({
            id: eventReportTable.id,
            attendance: eventReportTable.attendance,
        })
        .from(eventReportTable);

    return eventDataADMIN;
}
