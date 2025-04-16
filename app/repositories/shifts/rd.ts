import { json } from "@remix-run/node";
import { asc, eq, sql } from "drizzle-orm";
import { RDScheduleCSV } from "~/schemas/schedules/RDScheduleCSV";
import {
  CreatedStaffShift,
  UpdatedStaffShift,
} from "~/schemas/shifts/staffShift";
import { db } from "~/utilties/postgres.server";
import { csv } from "~/utilties/csv";
import { formatDateWithoutOffset } from "~/utilties/formatDate";
import mutate from "~/utilties/mutate.server";
import { staffShiftTable, staffTable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

/**
 * Reads the RD duty schedule
 */
export async function readShiftsRDAsAdmin() {
  const data = await db.client
    .select({
      id: staffShiftTable.id,
      staffId: staffTable.id,
      name: sql<string>`CONCAT(${staffTable.firstName}, ' ', ${staffTable.lastName})`,
      date: staffShiftTable.date,
    })
    .from(staffShiftTable)
    .where(sql`${staffShiftTable.date} >= CURRENT_DATE`)
    .innerJoin(staffTable, eq(staffShiftTable.staffId, staffTable.id))
    .orderBy(asc(staffShiftTable.date));

  const formattedData = data.map((shift) => ({
    ...shift,
    day: formatDateWithoutOffset(shift.date),
  }));

  return formattedData;
}

/**
 * Updates an RD on-duty shift
 */
export async function updateRDShift(request: Request, values: Values) {
  return db.update(
    request,
    staffShiftTable,
    UpdatedStaffShift,
    values,
    (staffShift) => eq(staffShiftTable.id, staffShift.id),
    {
      message: "Updated shift",
      level: "success",
    }
  );
}

/**
 * Creates a new RD on-duty shift
 */
export async function createRDShift(request: Request, values: Values) {
  return await db.insert(
    request,
    staffShiftTable,
    CreatedStaffShift,
    values,
    true,
    {
      message: "Created shift",
      level: "success",
    }
  );
}

/**
 * Deletes an RD on-duty shift
 */
export async function deleteRDShift(request: Request, values: Values) {
  return db.delete(
    request,
    staffShiftTable,
    values,
    (id) => eq(staffShiftTable.id, id),
    {
      message: "Deleted shift",
      level: "success",
    }
  );
}

/**
 * Upload RD on-duty schedule from CSV
 */
export async function uploadDutyScheduleForRD(values: Values) {
  const file = values["file"] as File;
  const arrayBuffer = await file.arrayBuffer();
  const content = new TextDecoder("utf-8").decode(arrayBuffer);
  const data = csv.parse(content);
  console.log(data);

  const errors: {
    rowNumber: number;
    error: string;
  }[] = [];
  const erroredRows: Record<string, string>[] = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    //check to see if row has the correct data
    if (!row["Email"] || !row["Date"]) {
      errors.push({ rowNumber: i + 1, error: "Missing Email or Date" });
      continue;
    }

    const parsedDate = new Date(row["Date"].trim());
    const midnightUTC = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate()
      )
    );
    console.log(midnightUTC);

    const formattedRow = {
      email: row["Email"].trim().toUpperCase(),
      date: midnightUTC,
    };
    const result = RDScheduleCSV.safeParse(formattedRow);

    //get staffId based on email
    const staffRecord = await db.client
      .select({ staffId: staffTable.id })
      .from(staffTable)
      .where(eq(staffTable.emailAddress, formattedRow.email))
      .limit(1);

    if (staffRecord.length === 0) {
      errors.push({
        rowNumber: i + 1,
        error: `No staff found for email: ${formattedRow.email}`,
      });
      continue;
    }

    const staffId = staffRecord[0].staffId;

    const newRow = {
      staffId: staffId,
      date: formattedRow.date,
    };
    const newResult = RDScheduleCSV.safeParse(newRow);

    if (newResult.success) {
      const formattedData = {
        ...newResult.data,
        staffId,
      };
      await db.client.insert(staffShiftTable).values(formattedData);
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

  return mutate("/staff/shifts/rd", {
    message: "Upload Successful",
    level: "success",
  });
}
