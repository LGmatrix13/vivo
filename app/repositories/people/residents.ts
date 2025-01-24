import { sql, eq, asc, notExists, SQL } from "drizzle-orm";
import { alias, PgTable } from "drizzle-orm/pg-core";
import { IResident } from "~/models/people";
import { RD } from "~/schemas/people/rd";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import {
  residentTable,
  buildingTable,
  roomTable,
  zoneTable,
  staffTable,
} from "~/utilties/schema.server";

type Values = { [key: string]: any };

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

export async function readResidentsDropdown(table: PgTable, predicate: SQL) {
  const rds = await db.client
    .select({
      id: residentTable.id,
      resident:
        sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
          "rd"
        ),
    })
    .from(residentTable)
    .where(notExists(db.client.select().from(table).where(predicate)))
    .orderBy(asc(residentTable.lastName));

  return rds;
}

export async function createResident(values: Values, request: Request) {
  return db.insert(request, residentTable, RD, values, {
    message: "Created Resident",
    level: "success",
  });
}

export async function updateResident(values: Values, request: Request) {
  return db.update(
    request,
    residentTable,
    RD,
    values,
    (values) => eq(residentTable.id, values.id),
    {
      message: "Updated Resident",
      level: "success",
    }
  );
}

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
