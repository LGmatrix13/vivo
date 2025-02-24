import { eventReportTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { eq, sql } from "drizzle-orm";


export async function viewEventInsightsRA() {
    const data = await db.client
        .select({
            id: eventReportTable.id,
            description: eventReportTable.description,
            zoneId: eventReportTable.zoneId,
            attendance: eventReportTable.attendance,
        })
        .from(eventReportTable)

    const formattedData = data.map((event) => {
        return {
            ...event,
        };
    });

    return formattedData;
}
export async function eventInsights(buildingId: number) {
    const data = await db.client
        .select({
            eventCount: sql`COUNT(*)`.mapWith(Number).as('eventCount'),
            totalAttendance: sql`SUM(${eventReportTable.attendance})`.as('totalAttendance')
        })
        .from(eventReportTable)
        .where(eq(eventReportTable.zoneId, buildingId));

    return {
        eventCount: data[0].eventCount,
        totalAttendance: data[0].totalAttendance,
    };
}
