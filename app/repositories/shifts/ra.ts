import { sql, eq, asc, and, exists } from "drizzle-orm";
import { UpdatedZoneShift, CreatedZoneShift } from "~/schemas/shifts/zoneShift";
import { RAScheduleCSV } from "~/schemas/schedules/RAScheduleCSV";
import { db } from "~/utilties/connection.server";
import { csv } from "~/utilties/csv";
import {
  buildingTable,
  residentTable,
  roomTable,
  zoneShiftTable,
  zoneTable,
} from "~/utilties/schema.server";
import { json } from "@remix-run/node";
import mutate from "~/utilties/mutate.server";
type Values = { [key: string]: any };

export async function readShiftsRAAsAdmin() {
  const data = await db.client
    .select({
      id: zoneShiftTable.id,
      zoneId: zoneTable.id,
      name: sql<string>`CONCAT(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      date: zoneShiftTable.date,
      buildingId: buildingTable.id,
    })
    .from(zoneShiftTable)
    .where(sql`${zoneShiftTable.date} >= CURRENT_DATE`)
    .innerJoin(zoneTable, eq(zoneShiftTable.zoneId, zoneTable.id))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .orderBy(asc(zoneShiftTable.date));

  return data;
}

export async function readShiftsRAAsRA(id: number) {
  const data = await db.client
    .select({
      id: zoneShiftTable.id,
      zoneId: zoneTable.id,
      name: sql<string>`CONCAT(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      date: zoneShiftTable.date,
      buildingId: buildingTable.id,
    })
    .from(zoneShiftTable)
    .where(
      and(
        sql`${zoneShiftTable.date} >= CURRENT_DATE`,
        exists(
          db.client
            .select()
            .from(buildingTable)
            .innerJoin(zoneTable, eq(zoneTable.staffId, buildingTable.staffId))
            .where(eq(zoneTable.id, id))
        )
      )
    )
    .innerJoin(zoneTable, eq(zoneShiftTable.zoneId, zoneTable.id))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .orderBy(asc(zoneShiftTable.date));

  return data;
}

export async function readShiftsRAAsRD(id: number) {
  const data = await db.client
    .select({
      id: zoneShiftTable.id,
      zoneId: zoneTable.id,
      name: sql<string>`CONCAT(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      date: zoneShiftTable.date,
      buildingId: buildingTable.id,
    })
    .from(zoneShiftTable)
    .where(
      and(
        sql`${zoneShiftTable.date} >= CURRENT_DATE`,
        eq(zoneTable.staffId, id)
      )
    )
    .innerJoin(zoneTable, eq(zoneShiftTable.zoneId, zoneTable.id))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .orderBy(asc(zoneShiftTable.date));

  return data;
}



export async function createRAShift(request: Request, values: Values) {
  return db.insert(request, zoneShiftTable, CreatedZoneShift, values, true,{
    message: "Created shift",
    level: "success",
  });
}

export async function updateRAShift(request: Request, values: Values) {
  return db.update(
    request,
    zoneShiftTable,
    UpdatedZoneShift,
    values,
    (values) => eq(zoneShiftTable.id, values.id),
    {
      message: "Updated shift",
      level: "success",
    }
  );
}

export async function deleteRAShift(request: Request, values: Values) {
  return db.delete(
    request,
    zoneShiftTable,
    values,
    (id) => eq(zoneShiftTable.id, id),
    {
      message: "Deleted shift",
      level: "success",
    }
  );
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
      date: row["Date"].trim(),
    };
    const result = RAScheduleCSV.safeParse(formattedRow);

    if (result.success) {
      const formattedData = {
        ...result.data,
        date:
          result.data.date instanceof Date
            ? result.data.date.toISOString()
            : result.data.date,
      };
      await db.client.insert(zoneShiftTable).values(formattedData);
      console.log("row added");
    } else {
      console.log("The row was not a success");
    }
  }

  if (errors.length) {
    return json({
      errors,
      erroredRows,
    });
  }

  return mutate("/staff/shifts/upload", {
    message: "Upload Successful",
    level: "success",
  });
}
