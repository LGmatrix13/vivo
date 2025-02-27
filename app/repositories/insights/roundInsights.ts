import { roundReportTable, readTable, buildingTable, zoneTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { and, eq, sql } from "drizzle-orm";
import { formatDate } from "~/utilties/formatDate";

export async function RoundReportInsightsAsRD(buildingId: number) {
    const violationCount = await db.client
        .select({
            violationCount: sql`
                COUNT(CASE WHEN ${roundReportTable.violations} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('violationCount'),
        })
        .from(roundReportTable)
        .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id))
        .where(eq(buildingTable.id, buildingId));

    const outstandingWorkOrderCount = await db.client
        .select({
            outstandingWorkOrderCount: sql`
                COUNT(CASE WHEN ${roundReportTable.outstandingWorkOrders} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('outstandingWorkOrderCount'),
        })
        .from(roundReportTable)
        .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id))
        .where(eq(buildingTable.id, buildingId));

    return {
        violationCount: violationCount[0]?.violationCount,
        outstandingWorkOrderCount: outstandingWorkOrderCount[0]?.outstandingWorkOrderCount,
    };
}

export async function RoundReportInsightsAsADMIN() {
    const violationCount = await db.client
        .select({
            violationCount: sql`
                SUM(CASE WHEN ${roundReportTable.violations} IS NOT NULL THEN 1 ELSE 0 END)::integer
            `.mapWith(Number).as('violationCount'),
        })
        .from(roundReportTable)
        .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id));

    const outstandingWorkOrderCount = await db.client
        .select({
            outstandingWorkOrderCount: sql`
                SUM(CASE WHEN ${roundReportTable.outstandingWorkOrders} IS NOT NULL THEN 1 ELSE 0 END)::integer
            `.mapWith(Number).as('outstandingWorkOrderCount'),
        })
        .from(roundReportTable)
        .innerJoin(buildingTable, eq(roundReportTable.zoneId, buildingTable.id));

    return {
        violationCount: violationCount[0]?.violationCount,
        outstandingWorkOrderCount: outstandingWorkOrderCount[0]?.outstandingWorkOrderCount,
    };
}

export async function RoundReportInsightsAsRA(zoneId: number) {
    const violationCount = await db.client
        .select({
            violationCount: sql`
                COUNT(CASE WHEN ${roundReportTable.violations} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('violationCount'),
        })
        .from(roundReportTable)
        .innerJoin(zoneTable, eq(roundReportTable.zoneId, zoneTable.id))
        .where(eq(zoneTable.id, zoneId));

    const outstandingWorkOrderCount = await db.client
        .select({
            outstandingWorkOrderCount: sql`
                COUNT(CASE WHEN ${roundReportTable.outstandingWorkOrders} IS NOT NULL THEN 1 END)
            `.mapWith(Number).as('outstandingWorkOrderCount'),
        })
        .from(roundReportTable)
        .innerJoin(zoneTable, eq(roundReportTable.zoneId, zoneTable.id))
        .where(eq(zoneTable.id, zoneId));

    return {
        violationCount: violationCount[0]?.violationCount,
        outstandingWorkOrderCount: outstandingWorkOrderCount[0]?.outstandingWorkOrderCount,
    };
}