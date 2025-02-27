import { eventReportTable, residentTable, roomTable, zoneTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { eq, sql } from "drizzle-orm";


export async function eventInsightsAsRA(zoneId: number) {
    const eventDataRA = await db.client
         .select({
             eventCount: sql`COUNT(CASE WHEN ${eventReportTable.id} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('eventCount'),
         })
        .from(eventReportTable)
        .where(eq(eventReportTable.zoneId, zoneId));
    
    const attendanceDataRA = await db.client
        .select({
            totalAttendance: sql`SUM(CASE WHEN ${eventReportTable.attendance} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('totalAttendance'),
        })
        .from(eventReportTable)
        .where(eq(eventReportTable.zoneId, zoneId));

    return {
        eventCount: eventDataRA[0]?.eventCount,
        totalAttendance: attendanceDataRA[0]?.totalAttendance,
    };
}

// FIX
export async function eventInsightsAsRD(buildingId: number) {
    const eventDataRD = await db.client
        .select({
            eventCount: sql`COUNT(CASE WHEN ${eventReportTable.id} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('eventCount'),
        })
        .from(eventReportTable)
        .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
        .innerJoin(roomTable, eq(zoneTable.id, roomTable.zoneId))
        .where(eq(roomTable.buildingId, buildingId))
        .groupBy(eventReportTable.zoneId);

    const attendanceDataRD = await db.client
        .select({
            totalAttendance: sql`SUM(CASE WHEN ${eventReportTable.attendance} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('totalAttendance'),
        })
        .from(eventReportTable)
        .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
        .innerJoin(roomTable, eq(zoneTable.id, roomTable.zoneId))
        .where(eq(roomTable.buildingId, buildingId))
        .groupBy(eventReportTable.zoneId);

    return {
        eventCount: eventDataRD[0]?.eventCount,
        totalAttendance: attendanceDataRD[0]?.totalAttendance,
    };
}

export async function eventInsightsAsADMIN() {
    const eventDataADMIN = await db.client
        .select({
            eventCount: sql`COUNT(CASE WHEN ${eventReportTable.id} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('eventCount'),
        })
        .from(eventReportTable);
    
    const attendanceDataADMIN = await db.client
        .select({
            totalAttendance: sql`SUM(CASE WHEN ${eventReportTable.attendance} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('totalAttendance'),
        })
        .from(eventReportTable);

    return {
        eventCount: eventDataADMIN[0]?.eventCount,
        totalAttendance: attendanceDataADMIN[0]?.totalAttendance,
    };
}

export async function lastEvent(zoneId: number){
    const data = await db.client
        .select({
          daysSinceLastEvent: sql`DATE_PART('day', NOW() - MAX(${eventReportTable.time}))`
        })
        .from(eventReportTable)
        .where(eq(eventReportTable.zoneId, zoneId));

    return data
}
