import { sql, eq } from "drizzle-orm";
import { RDScheduleCSV } from "~/schemas/schedules/RDScheduleCSV";
import { db } from "~/utilties/postgres.server";
import { csv } from "~/utilties/csv";
import {
  buildingTable,
  residentTable,
  roomTable,
  staffShiftTable,
  staffTable,
  zoneShiftTable,
  zoneTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function readOnDutyRAAsAdmin() {
  const data = await db.client
    .select({
      zoneId: zoneTable.id,
      date: zoneShiftTable.date,
      name: sql<string>`CONCAT(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      email: residentTable.emailAddress,
      phoneNumber: residentTable.phoneNumber,
      room: sql<string>`CONCAT(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      buildingId: buildingTable.id,
      latitude: buildingTable.latitude,
      longitude: buildingTable.longitude,
    })
    .from(zoneShiftTable)
    .innerJoin(zoneTable, eq(zoneShiftTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(buildingTable.staffId, staffTable.id))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .where(sql`${zoneShiftTable.date} = CURRENT_DATE - INTERVAL '1 day'`);

  return data;
}

export async function readOnDutyRAAsRD(id: number) {
  const data = await db.client
    .select({
      zoneId: zoneTable.id,
      date: zoneShiftTable.date,
      name: sql<string>`CONCAT(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      email: residentTable.emailAddress,
      phoneNumber: residentTable.phoneNumber,
      room: sql<string>`CONCAT(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      buildingId: buildingTable.id,
      latitude: buildingTable.latitude,
      longitude: buildingTable.longitude,
    })
    .from(zoneShiftTable)
    .innerJoin(zoneTable, eq(zoneShiftTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(buildingTable.staffId, staffTable.id))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .where(sql`${zoneShiftTable.date} = CURRENT_DATE`);

  return data;
}

export async function readOnDutyRD() {
  const data = await db.client
    .select({
      staffId: staffTable.id,
      date: staffShiftTable.date,
      building: buildingTable.name,
      email: staffTable.emailAddress,
      name: sql<string>`CONCAT(${staffTable.firstName}, ' ', ${staffTable.lastName})`,
    })
    .from(staffShiftTable)
    .innerJoin(
      buildingTable,
      eq(staffShiftTable.staffId, buildingTable.staffId)
    )
    .innerJoin(staffTable, eq(staffShiftTable.staffId, staffTable.id))
    .where(sql`${staffShiftTable.date} = CURRENT_DATE`);

  return data;
}
