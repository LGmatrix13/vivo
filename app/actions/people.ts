import { json } from "@remix-run/node";
import { eq, and } from "drizzle-orm";
import { IARD, IRA, IRD, IResident } from "~/models/people";
import { MasterCSV } from "~/schemas/masterCSV";
import { db } from "~/utilties/connection.server";
import { csv } from "~/utilties/csv";
import {
  assistantStaffTable,
  residentTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function createResident(values: Values) {
  try {
    await db.insert(residentTable).values(values as IResident);
  } catch (error) {
    console.error("Error:", error);
    console.log("Resident:", values);
  }
}

export async function updateResident(values: Values) {
  const resident = values as IResident;
  try {
    await db
      .update(residentTable)
      .set(resident)
      .where(eq(residentTable.id, resident.id));
  } catch (error) {
    console.error("Error:", error);
    console.log("Resident:", resident);
  }
}

export async function createRD(values: Values) {
  const rd = values as IRD;
  try {
    await db.insert(staffTable).values(rd);
  } catch (error) {
    console.error("Error:", error);
    console.log("RD:", rd);
  }
}

export async function updateRD(values: Values) {
  const rd = values as IRD;
  try {
    await db.update(staffTable).set(rd).where(eq(staffTable.id, rd.id));
  } catch (error) {
    console.error("Error:", error);
    console.log("RD:", rd);
  }
}

export async function deleteRD(values: Values) {
  const id = Number(values["id"]);
  try {
    await db.delete(staffTable).where(eq(staffTable.id, id));
  } catch (error) {
    console.error("Error:", error);
    console.log("RD id:", id);
  }
}

export async function deleteResident(values: Values) {
  const id = Number(values["id"]);
  try {
    await db.delete(residentTable).where(eq(residentTable.id, id));
  } catch (error) {
    console.error("Error:", error);
    console.log("Resident id:", id);
  }
}

export async function createRA(values: Values) {
  const ra = values as IRA;
  try {
    await db.insert(zoneTable).values(ra);
  } catch (error) {
    console.error("Error:", error);
    console.log("RA:", ra);
  }
}

export async function deleteRA(values: Values) {
  const id = Number(values["id"]);
  try {
    await db.delete(zoneTable).where(eq(zoneTable.id, id));
  } catch (error) {
    console.error("Error:", error);
    console.log("RA id:", id);
  }
}

export async function createARD(values: Values) {
  const ard = values as IARD;
  try {
    await db.insert(assistantStaffTable).values(ard);
  } catch (error) {
    console.error("Error:", error);
    console.log("ARD:", ard);
  }
}

export async function updateARD(values: Values) {
  const ard = values as IARD;
  try {
    await db
      .update(assistantStaffTable)
      .set({
        staffId: ard.staffId,
      })
      .where(eq(assistantStaffTable.id, ard.id));
  } catch (error) {
    console.error("Error:", error);
    console.log("ARD:", ard);
  }
}

export async function deleteARD(values: Values) {
  const id = Number(values["id"]);
  try {
    await db.delete(assistantStaffTable).where(eq(assistantStaffTable.id, id));
  } catch (error) {
    console.error("Error:", error);
    console.log("ARD ID:", id);
  }
}

export async function uploadMasterCSV(values: Values) {
  const file = values["file"] as File;

  if (!(file instanceof File)) {
    throw new Error("Uploaded value is not a valid file.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const content = new TextDecoder("utf-8").decode(arrayBuffer);
  const data = csv.parse(content);

  const errors = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const formattedRow = {
      studentId: row["ID"],
      firstName: row["First Name"],
      lastName: row["Last Name"],
      suite: row["Suite"],
      room: row["Room"],
      roomType: row["Room Type"],
      zone: row["Zone"],
      ra: row["RA"],
      city: row["City"],
      state: row["State"],
      phoneNumber: row["Phone"],
      emailAddress: row["Email"],
      mailbox: row["Mailbox"],
      class: row["Class"],
      gender: row["Gender"],
    };
    const result = MasterCSV.safeParse(formattedRow);

    if (!result.success) {
      errors.push({
        rowNumber: i + 1,
        errors: result.error.errors,
      });
    }
    else {
      createResident(result.data);
    }
    if (result.data?.ra === `${result.data?.lastName}, ${result.data?.firstName}`) {
      var raData = await db
        .select({
          residentId: residentTable.id,
          roomId: residentTable.roomId})
        .from(residentTable)
        .where(and(eq(residentTable.firstName, result.data.firstName), eq(residentTable.lastName, result.data.lastName)));
      raData = raData.map(item => ({ ...item, alias: result.data?.zone }));
      createRA(raData);
    }
  }

  if (errors.length) {
    return json({
      errors,
    });
  }
}
