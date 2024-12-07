import { json } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { MasterCSV } from "~/schemas/masterCSV";
import { db } from "~/utilties/connection.server";
import { csv } from "~/utilties/csv";
import {
  assistantStaffTable,
  residentTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";

type Values = Record<string, FormDataEntryValue>;

export async function createResident(values: Values) {
  try {
    const residentData = {
      firstName: values["firstName"],
      lastName: values["lastName"],
      emailAddress: values["emailAddress"],
      city: values["city"],
      state: values["state"],
      phoneNumber: values["phoneNumber"],
      mailbox: values["mailbox"],
      class: values["class"],
      gender: values["gender"],
      studentId: Number(values["studentId"])
    };
    await db
      .insert(residentTable)
      .values(residentData)
  } catch (error) {
    console.log(values);
    console.log(error)
  }
  
}

export async function updateResident(values: Values) {
  console.log(values);
  throw new Error("Not yet implemented");
}

export async function createRD(values: Values) {
  console.log(values);
  throw new Error("Not yet implemented");
}

export async function updateRD(values: Values) {
  console.log(values);
  throw new Error("Not yet implemented");
}

export async function deleteRD(values: Values) {
  await db.delete(staffTable).where(eq(staffTable.id, Number(values["id"])));
}

export async function deleteResident(values: Values) {
  await db
    .delete(residentTable)
    .where(eq(residentTable.id, Number(values["id"])));
}

export async function createRA(values: Values) {
  console.log(values);
  throw new Error("Not yet implemented");
}

export async function deleteRA(values: Values) {
  await db.delete(zoneTable).where(eq(zoneTable.id, Number(values["id"])));
}

export async function createARD(values: Values) {
  console.log(values);
  throw new Error("Not yet implemented");
}

export async function updateARD(values: Values) {
  console.log(values);
  throw new Error("Not yet implemented");
}

export async function deleteARD(values: Values) {
  await db
    .delete(assistantStaffTable)
    .where(eq(assistantStaffTable.id, Number(values["id"])));
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
    const result = MasterCSV.safeParse(row);

    if (!result.success) {
      const rowErrors = result.error.errors.map((err) => ({
        rowNumber: i + 1,
        path: err.path.join("."),
        message: err.message,
      }));
      errors.push(...rowErrors);
    }
  }

  if (errors.length) {
    return json({
      errors,
    });
  }
}
