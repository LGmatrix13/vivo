import { eventReportTable, residentTable, zoneTable, staffTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { and, eq, sql } from "drizzle-orm";
import { buildingTable } from "~/utilties/schema.server";

export async function viewEventInsightsBuilding(zoneId: number) {
    const data = await db.client
        .select({
            eventReportCount: sql`COUNT(*)`.mapWith(Number).as('eventReportCount'),
            totalAttendance: sql`SUM(${eventReportTable.attendance})`.as('totalAttendance'),
            lastEventDate: sql`MAX(${eventReportTable.time})`.as('lastEventDate')
        })
        .from(eventReportTable)
        .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
        .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
        .innerJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
        .innerJoin(buildingTable, eq(residentTable.roomId, buildingTable.id))
        .where(eq(eventReportTable.zoneId, zoneId));

    return {
        totalEvents: data[0].eventReportCount,
        totalAttendance: data[0].totalAttendance,
        lastEventDate: data[0].lastEventDate,
    };
}

export async function viewEventInsightsPersonal(zoneId: number) {
    const data = await db.client
        .select({
            eventCount: sql`COUNT(*)`.mapWith(Number).as('eventCount'),
            totalAttendance: sql`SUM(${eventReportTable.attendance})`.as('totalAttendance'),
            lastEventDate: sql`MAX(${eventReportTable.time})`.as('lastEventDate')
        })
        .from(eventReportTable)
        .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
        .innerJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
        .where(eq(eventReportTable.zoneId, zoneId));

    return {
        eventCount: data[0].eventCount,
        totalAttendance: data[0].totalAttendance,
        lastEventDate: data[0].lastEventDate,
    };
}
