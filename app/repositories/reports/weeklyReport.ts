import { desc, eq, sql } from "drizzle-orm";
import { db } from "~/utilties/connection.server";
import { buildingTable, residentTable, roomTable, staffTable, weeklyReportTable, zoneTable } from "~/utilties/schema.server";

export async function readWeeklyReportsAsAdmin() {
    const weeklyReports = await db
        .select({
            id: weeklyReportTable.id,
            firstName: residentTable.firstName,
            lastName: residentTable.lastName,
            fullName:
                sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
                    "fullName"
                ),
            building: buildingTable.name,
            buildingId: buildingTable.id,
            submittedOn: weeklyReportTable.submittedOn,
            shortformattedDate: sql<string>`to_char(${weeklyReportTable.submittedOn}, 'Dy, FMMM/D')`.as(
                "shortformattedDate"
            ),
            longformattedDate: sql<string>`to_char(${weeklyReportTable.submittedOn}, 'Dy, Mon D, YYYY')`.as(
                "shortformattedDate"
            ),
            outstandWorkOrders: weeklyReportTable.outstandWorkOrders,
            raResponsibilities: weeklyReportTable.raResponsibilities,
            academics: weeklyReportTable.academics,
            spiritualHealth: weeklyReportTable.spiritualHealth,
            physicalHealth: weeklyReportTable.physicalHealth,
            mentalHealth: weeklyReportTable.mentalHealth,
            personalLife: weeklyReportTable.personalLife,
            technologyAndMedia: weeklyReportTable.technologyAndMedia,
            explainChoices: weeklyReportTable.explainChoices
        })
        .from(weeklyReportTable)
        .leftJoin(zoneTable, eq(weeklyReportTable.zoneId, zoneTable.id))
        .leftJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
        .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
        .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
        .orderBy(desc(weeklyReportTable.submittedOn));
    return weeklyReports;
}

export async function readWeeklyReportsAsRD(staffId: number) {
    const weeklyReports = await db
        .select({
            id: weeklyReportTable.id,
            firstName: residentTable.firstName,
            lastName: residentTable.lastName,
            fullName:
                sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
                    "fullName"
                ),
            building: buildingTable.name,
            buildingId: buildingTable.id,
            submittedOn: weeklyReportTable.submittedOn,
            shortformattedDate: sql<string>`to_char(${weeklyReportTable.submittedOn}, 'Dy, FMMM/D')`.as(
                "shortformattedDate"
            ),
            longformattedDate: sql<string>`to_char(${weeklyReportTable.submittedOn}, 'Dy, Mon D, YYYY')`.as(
                "shortformattedDate"
            ),
            outstandWorkOrders: weeklyReportTable.outstandWorkOrders,
            raResponsibilities: weeklyReportTable.raResponsibilities,
            academics: weeklyReportTable.academics,
            spiritualHealth: weeklyReportTable.spiritualHealth,
            physicalHealth: weeklyReportTable.physicalHealth,
            mentalHealth: weeklyReportTable.mentalHealth,
            personalLife: weeklyReportTable.personalLife,
            technologyAndMedia: weeklyReportTable.technologyAndMedia,
            explainChoices: weeklyReportTable.explainChoices
        })
        .from(weeklyReportTable)
        .leftJoin(zoneTable, eq(weeklyReportTable.zoneId, zoneTable.id))
        .leftJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
        .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
        .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
        .leftJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
        .where(eq(staffTable.id, staffId))
        .orderBy(desc(weeklyReportTable.submittedOn));
    return weeklyReports;
}