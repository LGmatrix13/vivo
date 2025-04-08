import { sql, eq, asc, notExists, SQL } from "drizzle-orm";
import { alias, PgTable } from "drizzle-orm/pg-core";
import { CreatedResident, Resident } from "~/schemas/people/resident";
import { db } from "~/utilties/postgres.server";
import {
  residentTable,
  buildingTable,
  roomTable,
  zoneTable,
  staffTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

/**
 * reads residents under a specific ra for a dropdown
 * @returns a list of those residents
 */
export async function readResidentsDropdownAsRA(zoneId: number) {
  const residents = await db.client
    .select({
      id: residentTable.id,
      name: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
        "fullName"
      ),
    })
    .from(residentTable)
    .innerJoin(roomTable, eq(roomTable.id, residentTable.roomId))
    .where(eq(roomTable.zoneId, zoneId));
  return residents;
}

/**
 * reads residents from the database for the admin, so all residents
 * @returns a list of those residents
 */
export async function readResidentsAsAdmin() {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const residents = await db.client
    .select({
      id: residentTable.id,
      firstName: residentTable.firstName,
      lastName: residentTable.lastName,
      fullName:
        sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
          "fullName"
        ),
      emailAddress: residentTable.emailAddress,
      phone: residentTable.phoneNumber,
      mailbox: residentTable.mailbox,
      hometown:
        sql<string>`concat(${residentTable.city}, ', ', ${residentTable.state})`.as(
          "hometown"
        ),
      class: residentTable.class,
      roomId: roomTable.id,
      roomBuilding:
        sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`.as(
        "ra"
      ),
      buildingId: buildingTable.id,
      gender: residentTable.gender,
      studentId: residentTable.studentId,
      city: residentTable.city,
      state: residentTable.state,
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .orderBy(residentTable.lastName, residentTable.firstName);
  return residents;
}

/**
 * reads residents from the database for a specific rd
 * @returns a list of those residents
 */
export async function readResidentsAsRD(id: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const residents = await db.client
    .select({
      id: residentTable.id,
      firstName: residentTable.firstName,
      lastName: residentTable.lastName,
      fullName:
        sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
          "fullName"
        ),
      emailAddress: residentTable.emailAddress,
      phone: residentTable.phoneNumber,
      mailbox: residentTable.mailbox,
      hometown:
        sql<string>`concat(${residentTable.city}, ', ', ${residentTable.state})`.as(
          "hometown"
        ),
      class: residentTable.class,
      roomId: roomTable.id,
      roomBuilding:
        sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`.as(
        "ra"
      ),
      buildingId: buildingTable.id,
      gender: residentTable.gender,
      studentId: residentTable.studentId,
      city: residentTable.city,
      state: residentTable.state,
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(staffTable, eq(staffTable.id, buildingTable.staffId))
    .where(eq(staffTable.id, id))
    .orderBy(residentTable.lastName, residentTable.firstName);
  return residents;
}

/**
 * reads residents from the database for a specific ra
 * @returns a list of those residents
 */
export async function readResidentsAsRA(id: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const residents = await db.client
    .select({
      id: residentTable.id,
      firstName: residentTable.firstName,
      lastName: residentTable.lastName,
      fullName:
        sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
          "fullName"
        ),
      emailAddress: residentTable.emailAddress,
      phone: residentTable.phoneNumber,
      mailbox: residentTable.mailbox,
      hometown:
        sql<string>`concat(${residentTable.city}, ', ', ${residentTable.state})`.as(
          "hometown"
        ),
      class: residentTable.class,
      roomId: roomTable.id,
      roomBuilding:
        sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`.as(
        "ra"
      ),
      buildingId: buildingTable.id,
      gender: residentTable.gender,
      studentId: residentTable.studentId,
      city: residentTable.city,
      state: residentTable.state,
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(staffTable, eq(staffTable.id, buildingTable.staffId))
    .where(eq(zoneTable.id, id))
    .orderBy(residentTable.lastName, residentTable.firstName);
  return residents;
}

/**
 * reads residents from the database
 * @returns a list of those residents
 */
export async function readResidents() {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const residents = await db.client
    .select({
      id: residentTable.id,
      firstName: residentTable.firstName,
      lastName: residentTable.lastName,
      fullName:
        sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
          "fullName"
        ),
      emailAddress: residentTable.emailAddress,
      phone: residentTable.phoneNumber,
      mailbox: residentTable.mailbox,
      hometown:
        sql<string>`concat(${residentTable.city}, ', ', ${residentTable.state})`.as(
          "hometown"
        ),
      class: residentTable.class,
      roomId: roomTable.id,
      roomBuilding:
        sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`.as(
        "ra"
      ),
      gender: residentTable.gender,
      studentId: residentTable.studentId,
      city: residentTable.city,
      state: residentTable.state,
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .orderBy(residentTable.lastName, residentTable.firstName);
  return residents;
}

/**
 * reads residents from the database for dropdown in the table
 * @returns a list of those residents
 */
export async function readResidentsDropdown(table: PgTable, predicate: SQL) {
  const rds = await db.client
    .select({
      id: residentTable.id,
      name: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
        "rd"
      ),
    })
    .from(residentTable)
    .where(notExists(db.client.select().from(table).where(predicate)))
    .orderBy(asc(residentTable.lastName));

  return rds;
}

/**
 * creates a new resident in the database
 * @returns whether or not creation was a success or not
 */
export async function createResident(values: Values, request: Request) {
  return await db.insert(
    request,
    residentTable,
    CreatedResident,
    values,
    true,
    {
      message: "Created Resident",
      level: "success",
    }
  );
}

/**
 * updates a resident in the database
 * @returns whether or not updating was a success or not
 */
export async function updateResident(values: Values, request: Request) {
  return db.update(
    request,
    residentTable,
    Resident,
    values,
    (values) => eq(residentTable.id, values.id),
    {
      message: "Updated Resident",
      level: "success",
    }
  );
}

/**
 * deletes a resident in the database
 * @returns whether or not deletion was a success or not
 */
export async function deleteResident(values: Values, request: Request) {
  return db.delete(
    request,
    residentTable,
    values,
    (id) => eq(residentTable.id, id),
    {
      message: "Deleted Resident",
      level: "success",
    }
  );
}

/**
 * selects a specific residents ra from the database to display their data
 * @returns a specific ra
 */
export async function myRA(resident_id: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const raRoomTable = alias(roomTable, "raRoomTable");
  const raBuildingTable = alias(buildingTable, "raBuildingTable");
  const ra = await db.client
    .select({
      zoneId: zoneTable.id,
      name: sql<string>`CONCAT(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      email: raInfoTable.emailAddress,
      phoneNumber: raInfoTable.phoneNumber,
      room: sql<string>`CONCAT(${raBuildingTable.name}, ' ', ${raRoomTable.roomNumber})`,
      buildingId: raBuildingTable.id,
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(raRoomTable, eq(raInfoTable.roomId, raRoomTable.id))
    .leftJoin(raBuildingTable, eq(raRoomTable.buildingId, raBuildingTable.id))
    .where(eq(residentTable.id, resident_id));
  return ra[0];
}
