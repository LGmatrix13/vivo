import { sql, eq } from "drizzle-orm";
import { RDScheduleCSV } from "~/schemas/schedules/RDScheduleCSV";
import { db } from "~/utilties/connection.server";
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
import { RAScheduleCSV } from "~/schemas/schedules/RAScheduleCSV";

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

//admin does this
export async function uploadDutyScheduleForRD(
  values: Values,
  request: Request
) {
  const file = values["file"] as File;

  if (!(file instanceof File)) {
    throw new Error("Uploaded value is not a valid file.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const content = new TextDecoder("utf-8").decode(arrayBuffer);
  const data = csv.parse(content);

  const errors: {
    rowNumber: number;
    error: string;
  }[] = [];
  const erroredRows: Record<string, string>[] = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const formattedRow = {
      staffId: row["ID"].trim(),
      date: new Date(row["Date"].trim()).toISOString(),
    };
    const result = RDScheduleCSV.safeParse(formattedRow);

    if (result.success) {
      const formattedData = {
        ...result.data,
        date:
          result.data.date instanceof Date
            ? result.data.date.toISOString()
            : result.data.date,
      };
      await db.client.insert(staffShiftTable).values(formattedData);
    }
  }
}

//rds do this
export async function uploadDutyScheduleForRAs(
  values: Values,
  request: Request
) {
  const file = values["file"] as File;

  if (!(file instanceof File)) {
    throw new Error("Uploaded value is not a valid file.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const content = new TextDecoder("utf-8").decode(arrayBuffer);
  const data = csv.parse(content);

  const errors: {
    rowNumber: number;
    error: string;
  }[] = [];
  const erroredRows: Record<string, string>[] = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const formattedRow = {
      zoneId: row["ID"].trim(),
      date: new Date(row["Date"].trim()).toISOString(),
    };
    const result = RAScheduleCSV.safeParse(formattedRow);

    if (result.success) {
      const formattedData = {
        ...result.data,
        date:
          result.data.date instanceof Date
            ? result.data.date.toISOString()
            : result.data.date, // Ensure date is a string
      };
      await db.client.insert(zoneShiftTable).values(formattedData);
    }
  }
}
