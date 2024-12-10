import { json } from "@remix-run/node";
import { sql, eq, asc, and } from "drizzle-orm";
import { IRA } from "~/models/people";
import { MasterCSV } from "~/schemas/masterCSV";
import { db } from "~/utilties/connection.server";
import { csv } from "~/utilties/csv";
import mutate from "~/utilties/mutate.server";
import {
  zoneTable,
  residentTable,
  buildingTable,
  roomTable,
  staffTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function readRAs() {
  const ras = await db
    .select({
      id: zoneTable.id,
      residentId: zoneTable.id,
      alias: zoneTable.alias,
      staffId: zoneTable.staffId,
      firstName: residentTable.firstName,
      lastName: residentTable.lastName,
      fullName:
        sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
          "fullName"
        ),
      email: residentTable.emailAddress,
      phone: residentTable.phoneNumber,
      mailbox: residentTable.mailbox,
      hometown:
        sql<string>`concat(${residentTable.city}, ', ', ${residentTable.state})`.as(
          "hometown"
        ),
      class: residentTable.class,
      building: buildingTable.name,
      buildingId: buildingTable.id,
      roomBuilding:
        sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
    })
    .from(zoneTable)
    .innerJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .leftJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .orderBy(
      residentTable.lastName,
      residentTable.firstName,
      buildingTable.name
    );

  return ras;
}

export async function readRAsDropdown() {
  const ras = await db
    .select({
      id: zoneTable.id,
      name: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
        "rd"
      ),
    })
    .from(residentTable)
    .innerJoin(zoneTable, eq(zoneTable.residentId, residentTable.id))
    .orderBy(asc(residentTable.lastName));

  return ras;
}

export async function createRA(values: Values, request: Request) {
  const ra = values as IRA;
  try {
    await db.insert(zoneTable).values(ra);
    return mutate(request.url, {
      message: "Resident Created",
      level: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("RA:", ra);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}

export async function deleteRA(values: Values, request: Request) {
  const id = Number(values["id"]);
  try {
    const roomsAssigned = await db
      .select()
      .from(roomTable)
      .where(eq(roomTable.zoneId, id));

    if (roomsAssigned.length) {
      return mutate(request.url, {
        message: "Resident is assigned to a room",
        level: "failure",
      });
    }

    await db.delete(zoneTable).where(eq(zoneTable.id, id));

    return mutate(request.url, {
      message: "Resident is assigned to a room",
      level: "failure",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("RA id:", id);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}

export async function updateRA(values: Values, request: Request) {
  const ra = values as IRA;
  try {
    await db.update(zoneTable).set(ra).where(eq(zoneTable.id, ra.id));
    return mutate(request.url, {
      message: "RA Updated",
      level: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("RA:", ra);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}

export async function uploadMasterCSV(values: Values, request: Request) {
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
      const roomIndex = result.data.room.search(
        /\b[a-zA-Z0-9\-]*\d[a-zA-Z0-9\-]*\b/
      );
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

      await db.insert(residentTable).values(residentData);

      if (
        result.data?.ra == `${result.data?.lastName}, ${result.data?.firstName}`
      ) {
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
        await db.insert(zoneTable).values(raData);
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

    if (result.success) {
      const room = (
        await db
          .select({
            roomId: residentTable.roomId,
          })
          .from(residentTable)
          .where(eq(residentTable.studentId, result.data.studentId))
      )[0];

      var zone = (
        await db
          .select({
            zoneId: zoneTable.id,
          })
          .from(zoneTable)
          .where(eq(zoneTable.alias, result.data.zone))
      )[0];

      await db
        .update(roomTable)
        .set({
          zoneId: zone.zoneId,
        })
        .where(eq(roomTable.id, room.roomId || -1));
    }
  }

  if (errors.length) {
    return json({
      errors,
    });
  }

  return mutate(request.url, {
    message: "Upload Successful",
    level: "success",
  });
}
