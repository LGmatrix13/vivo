import { sql, eq } from "drizzle-orm";
import {CreatedARD, UpdatedARD } from "~/schemas/people/ard";
import { db } from "~/utilties/postgres.server";
import {
  assistantStaffTable,
  residentTable,
  staffTable,
  buildingTable,
  roomTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

/**
 * read all Ards from the database
 * @returns the sql list of ards from the database
 */
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

/**
 * creates an ARD within the database 
 * @returns a message as to whether the creation was a success or not
 */
export async function createARD(values: Values, request: Request) {
  return await db.insert(
    request,
    assistantStaffTable,
    CreatedARD,
    values,
    true,
    {
      message: "ARD Created",
      level: "success",
    }
  );
}

/**
 * updates an ARD within the database 
 * @returns a message as to whether the update was a success or not
 */
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

/**
 * deletes an ARD within the database 
 * @returns a message as to whether the deletion was a success or not
 */
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
