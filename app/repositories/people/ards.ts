import { sql, eq } from "drizzle-orm";
import { IARD } from "~/models/people";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import {
  assistantStaffTable,
  residentTable,
  staffTable,
  buildingTable,
  roomTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function readARDs() {
  const ards = await db
    .select({
      id: assistantStaffTable.id,
      firstName: residentTable.firstName,
      lastName: residentTable.lastName,
      residentId: residentTable.id,
      staffId: staffTable.id,
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
      roomBuilding:
        sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
      buildingId: buildingTable.id,
    })
    .from(assistantStaffTable)
    .innerJoin(
      residentTable,
      eq(assistantStaffTable.residentId, residentTable.id)
    )
    .innerJoin(staffTable, eq(assistantStaffTable.staffId, staffTable.id))
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id));

  return ards;
}

export async function createARD(values: Values, request: Request) {
  const ard = values as IARD;
  try {
    await db.insert(assistantStaffTable).values(ard);
    return mutate(request.url, {
      message: "ARD Created",
      level: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("ARD:", ard);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "success",
  });
}

export async function updateARD(values: Values, request: Request) {
  const ard = values as IARD;
  try {
    await db
      .update(assistantStaffTable)
      .set({
        staffId: ard.staffId,
      })
      .where(eq(assistantStaffTable.id, ard.id));
    return mutate(request.url, {
      message: "ARD Updated",
      level: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("ARD:", ard);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "success",
  });
}

export async function deleteARD(values: Values, request: Request) {
  const id = Number(values["id"]);
  try {
    await db.delete(assistantStaffTable).where(eq(assistantStaffTable.id, id));
    return mutate(request.url, {
      message: "ARD Deleted",
      level: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    console.log("ARD ID:", id);
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "success",
  });
}
