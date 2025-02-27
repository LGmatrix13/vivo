import { db } from "~/utilties/connection.server";
import { RCITable, residentTable, zoneTable, roomTable } from "~/utilties/schema.server";
import { eq, sql } from "drizzle-orm";

export async function rciInsightsAsRA(zoneId: number) {
    const rciDataRA = await db.client
        .select({
            firstName: residentTable.firstName,
            lastName: residentTable.lastName,
            completedRCIs: sql`SUM(CASE WHEN ${RCITable.status} != 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("completedRCIs"),
            uncompletedRCIs: sql`SUM(CASE WHEN ${RCITable.status} = 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("uncompletedRCIs")
        })
        .from(RCITable)
        .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
        .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
        .innerJoin(zoneTable, eq(roomTable.zoneId, zoneId))
        .where(eq(zoneTable.id, zoneId))
        .groupBy(residentTable.id)

    return rciDataRA;
}

export async function rciInsightsAsRD(buildingId: number) {
    const rciDataRD = await db.client
        .select({
            firstName: residentTable.firstName,
            lastName: residentTable.lastName,
            completedRCIs: sql`SUM(CASE WHEN ${RCITable.status} != 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("completedRCIs"),
            uncompletedRCIs: sql`SUM(CASE WHEN ${RCITable.status} = 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("uncompletedRCIs")
        })
        .from(RCITable)
        .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
        .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
        .where(eq(roomTable.buildingId, buildingId))
        .groupBy(residentTable.id)

    return rciDataRD;
}

export async function rciInsightsAsADMIN() {
    const rciDataADMIN = await db.client
        .select({
            firstName: residentTable.firstName,
            lastName: residentTable.lastName,
            completedRCIs: sql`SUM(CASE WHEN ${RCITable.status} != 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("completedRCIs"),
            uncompletedRCIs: sql`SUM(CASE WHEN ${RCITable.status} = 'IN_PROGRESS' THEN 1 ELSE 0 END)::integer`.mapWith(Number).as("uncompletedRCIs")
        })
        .from(RCITable)
        .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
        .groupBy(residentTable.id)
        
    return rciDataADMIN;
}