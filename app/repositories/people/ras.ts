import { json } from "@remix-run/node";
import { sql, eq, asc, and } from "drizzle-orm";
//import { IRA } from "~/models/people";
import { MasterCSV } from "~/schemas/people/masterCSV";
import { CreatedRA, RA } from "~/schemas/people/ra";
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

export async function readRAsAsAdmin() {
  const ras = await db.client
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
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .orderBy(
      residentTable.lastName,
      residentTable.firstName,
      buildingTable.name
    );

  return ras;
}

export async function readRAsAsRD(id: number) {
  const ras = await db.client
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
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .where(eq(staffTable.id, id))
    .orderBy(
      residentTable.lastName,
      residentTable.firstName,
      buildingTable.name
    );

  return ras;
}

export async function readRAsDropdownAsAdmin() {
  const ras = await db.client
    .select({
      id: zoneTable.id,
      name: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
        "rd"
      ),
      buildingId: buildingTable.id,
    })
    .from(residentTable)
    .innerJoin(zoneTable, eq(zoneTable.residentId, residentTable.id))
    .innerJoin(staffTable, eq(staffTable.id, zoneTable.staffId))
    .innerJoin(buildingTable, eq(buildingTable.staffId, staffTable.id))
    .orderBy(asc(residentTable.lastName));

  return ras;
}

export async function readRAsDropdownAsRD(id: number) {
  const ras = await db.client
    .select({
      id: zoneTable.id,
      name: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
        "rd"
      ),
      buildingId: buildingTable.id,
    })
    .from(residentTable)
    .innerJoin(zoneTable, eq(zoneTable.residentId, residentTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(buildingTable.staffId, staffTable.id))
    .where(eq(staffTable.id, id))
    .orderBy(asc(residentTable.lastName));

  return ras;
}

export async function createRA(values: Values, request: Request) {
  return db.insert(request, zoneTable, CreatedRA, values, {
    message: "Resident Created",
    level: "success",
  });
}

export async function deleteRA(values: Values, request: Request) {
  const id = Number(values["id"]);
  const roomsAssigned = await db.client
    .select()
    .from(roomTable)
    .where(eq(roomTable.zoneId, id));

  if (roomsAssigned.length) {
    return mutate(request.url, {
      message: "Residents are assigned to this RA",
      level: "failure",
    });
  }

  await db.client.delete(zoneTable).where(eq(zoneTable.id, id));

  return mutate(request.url, {
    message: "RA Deleted",
    level: "failure",
  });
}

export async function updateRA(values: Values, request: Request) {
  return db.update(
    request,
    zoneTable,
    RA,
    values,
    (values) => eq(zoneTable.id, values.id),
    {
      message: "RA Updated",
      level: "success",
    }
  );
}

export async function uploadMasterCSV(values: Values, request: Request) {
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
      result.error.errors.forEach((error) => {
        errors.push({
          rowNumber: i + 1,
          error: error.message,
        });
      });
      erroredRows.push(row);
    } else {
      const roomIndex = result.data.room.search(
        /\b[a-zA-Z0-9\-]*\d[a-zA-Z0-9\-]*\b/
      );
      const buildingName = result.data.room.slice(0, roomIndex).trim();
      const roomNumber = result.data.room.slice(roomIndex).trim();

      let room = await db.client
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
            await db.client
              .select({ id: buildingTable.id })
              .from(buildingTable)
              .where(eq(buildingTable.name, buildingName))
          )[0].id, //TODO: this could throw an error if building not found
          capacity: stringToNumberMap[result.data.roomType.toLowerCase()] || 0,
        };
        room = await db.client
          .insert(roomTable)
          .values(roomInfo)
          .returning({ roomId: roomTable.id });
      }
      const residentData = {
        ...result.data,
        roomId: room[0].roomId,
      };

      await db.client.insert(residentTable).values(residentData);

      if (
        result.data.ra == `${result.data.lastName}, ${result.data.firstName}`
      ) {
        const ras = await db.client
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
        const rasWithAlias = ras.map((item) => ({
          ...item,
          alias: result.data.zone,
        }));
        await db.client.insert(zoneTable).values(rasWithAlias);
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
        await db.client
          .select({
            roomId: residentTable.roomId,
          })
          .from(residentTable)
          .where(eq(residentTable.studentId, result.data.studentId))
      )[0];

      const zone = (
        await db.client
          .select({
            zoneId: zoneTable.id,
          })
          .from(zoneTable)
          .where(eq(zoneTable.alias, result.data.zone))
      )[0];

      await db.client
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
      erroredRows,
    });
  }

  return mutate("/staff/admin/people/residents", {
    message: "Upload Successful",
    level: "success",
  });
}
