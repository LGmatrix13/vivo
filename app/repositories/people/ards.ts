import { sql, eq } from "drizzle-orm";
import { ARD, CreatedARD, UpdatedARD } from "~/schemas/people/ard";
import { db } from "~/utilties/connection.server";
import {
  assistantStaffTable,
  residentTable,
  staffTable,
  buildingTable,
  roomTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function readARDs() {
  const ards = await db.client
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
  return db.insert(request, assistantStaffTable, CreatedARD, values, {
    message: "ARD Created",
    level: "success",
  });
}

export async function updateARD(values: Values, request: Request) {
  return db.update(
    request,
    assistantStaffTable,
    UpdatedARD,
    values,
    (values) => eq(assistantStaffTable.id, values.id),
    {
      message: "ARD Updated",
      level: "success",
    }
  );
}

export async function deleteARD(values: Values, request: Request) {
  return db.delete(
    request,
    assistantStaffTable,
    values,
    (id) => eq(assistantStaffTable.id, id),
    {
      message: "ARD Deleted",
      level: "success",
    }
  );
}
