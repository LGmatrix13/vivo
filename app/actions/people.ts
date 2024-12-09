import { json } from "@remix-run/node";
import { eq, and } from "drizzle-orm";
import { IARD, IRA, IRD, IResident } from "~/models/people";
import { MasterCSV } from "~/schemas/masterCSV";
import { db } from "~/utilties/connection.server";
import { csv } from "~/utilties/csv";
import {
  assistantStaffTable,
  buildingTable,
  residentTable,
  roomTable,
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
    const rasAssigned = await db
      .select()
      .from(zoneTable)
      .where(eq(zoneTable.staffId, id));
    if (rasAssigned.length) {
      return json({
        error:
          "This RD has RAs assigned to them. Delete RAs assigned to them to delete this RD first.",
      });
    } else {
      await db.delete(staffTable).where(eq(staffTable.id, id));
    }
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
    const roomsAssigned = await db
      .select()
      .from(roomTable)
      .where(eq(roomTable.zoneId, id));

    if (roomsAssigned.length) {
      return json({
        error:
          "This RA has rooms assigned to them. Delete rooms assigned to this RA first.",
      });
    }

    await db.delete(zoneTable).where(eq(zoneTable.id, id));
  } catch (error) {
    console.error("Error:", error);
    console.log("RA id:", id);
  }
}

export async function updateRA(values: Values) {
  const ra = values as IRA;
  try {
    await db.update(zoneTable).set(ra).where(eq(zoneTable.id, ra.id));
  } catch (error) {
    console.error("Error:", error);
    console.log("RA:", ra);
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
      studentId: row["ID"].trim(),
      firstName: row["First Name"].trim(),
      lastName: row["Last Name"].trim(),
      suite: row["Suite"].trim(),
      room: row["Room"].trim(),
      roomType: row["Room Type"].trim(),
      zone: row["Zone"].trim(),
      ra: row["RA"].trim(),
      city: row["City"].trim(),
      state: row["State"].trim(),
      phoneNumber: row["Phone"].trim(),
      emailAddress: row["Email"].trim(),
      mailbox: row["Mailbox"].trim(),
      class: row["Class"].trim(),
      gender: row["Gender"].trim(),
    };
    const result = MasterCSV.safeParse(formattedRow);

    if (!result.success) {
      errors.push({
        rowNumber: i + 1,
        errors: result.error.errors,
      });
    } else {
      const roomIndex = result.data.room.search(/\b[a-zA-Z0-9\-]*\d[a-zA-Z0-9\-]*\b/)
      const buildingName = result.data.room.slice(0, roomIndex).trim();
      const roomNumber = result.data.room.slice(roomIndex).trim();

      let room = await db
        .select({
          roomId: roomTable.id,
        })
        .from(roomTable)
        .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
        .where(
          and(
            eq(buildingTable.name, buildingName),
            eq(roomTable.roomNumber, roomNumber)
          )
        );

      if (room.length == 0) {
        const stringToNumberMap: Record<string, number> = {
          single: 1,
          double: 2,
          triple: 3,
          quad: 4,
        };
        const roomInfo = {
          roomNumber: roomNumber,
          buildingId: (
            await db
              .select({ id: buildingTable.id })
              .from(buildingTable)
              .where(eq(buildingTable.name, buildingName))
          )[0].id, //TODO: this could throw an error if building not found
          capacity: stringToNumberMap[result.data.roomType.toLowerCase()] || 0,
        };
        room = await db
          .insert(roomTable)
          .values(roomInfo)
          .returning({ roomId: roomTable.id });
      }
      const residentData = {
        ...result.data,
        roomId: room[0].roomId,
      };

      createResident(residentData);

      if (result.data?.ra == `${result.data?.lastName}, ${result.data?.firstName}`) {
        var raData = await db
          .select({
            residentId: residentTable.id,
            staffId: staffTable.id,
          })
          .from(residentTable)
          .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
          .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
          .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
          .where(
            and(
              eq(residentTable.firstName, result.data.firstName),
              eq(residentTable.lastName, result.data.lastName)
            )
          );
        raData = raData.map((item) => ({ ...item, alias: result.data?.zone }));
        createRA(raData);
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const formattedRow = {
      studentId: row["ID"].trim(),
      firstName: row["First Name"].trim(),
      lastName: row["Last Name"].trim(),
      suite: row["Suite"].trim(),
      room: row["Room"].trim(),
      roomType: row["Room Type"].trim(),
      zone: row["Zone"].trim(),
      ra: row["RA"].trim(),
      city: row["City"].trim(),
      state: row["State"].trim(),
      phoneNumber: row["Phone"].trim(),
      emailAddress: row["Email"].trim(),
      mailbox: row["Mailbox"].trim(),
      class: row["Class"].trim(),
      gender: row["Gender"].trim(),
    };
    const result = MasterCSV.safeParse(formattedRow);

    if (!result.success) {
      errors.push({
        rowNumber: i + 1,
        errors: result.error.errors,
      });
    }
    else {
      const room = (await db
        .select({
          roomId: residentTable.roomId,
        })
        .from(residentTable)
        .where(eq(residentTable.studentId, result.data.studentId))
      )[0];

      var zone = (await db
        .select({
          zoneId: zoneTable.id
        })
        .from(zoneTable)
        .where(eq(zoneTable.alias, result.data.zone))
      )[0];
      
      await db.update(roomTable)
      .set({
        zoneId: zone.zoneId
      })
      .where(eq(roomTable.id, room.roomId || -1));
    };
  }

  if (errors.length) {
    return json({
      errors,
    });
  }
}
