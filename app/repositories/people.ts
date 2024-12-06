import { sql, eq, asc, not } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/utilties/server/database/connection";
import {
  residentTable,
  buildingTable,
  roomTable,
  zoneTable,
  staffTable,
  assistantStaffTable,
} from "~/utilties/server/database/schema";

export async function readResidents() {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const residents = await db
    .select({
      id: residentTable.id,
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
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .orderBy(residentTable.lastName, residentTable.firstName);
  return residents;
}

export async function readRDs() {
  const rds = await db
    .select({
      id: staffTable.id,
      firstName: staffTable.firstName,
      lastName: staffTable.lastName,
      fullName:
        sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
          "fullName"
        ),
      email: staffTable.emailAddress,
      mailbox: staffTable.mailbox,
      buildings:
        sql<string>`STRING_AGG(${buildingTable.name}, ', ' ORDER BY ${buildingTable.name})`.as(
          "buildings"
        ),
    })
    .from(staffTable)
    .leftJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .groupBy(staffTable.id)
    .orderBy(staffTable.lastName, staffTable.firstName);
  return rds;
}

export async function readRAs() {
  const ras = await db
    .select({
      id: zoneTable.id,
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
      buildingTable.name,
      residentTable.lastName,
      residentTable.firstName
    );

  return ras;
}

export async function readARDs() {
  const ards = await db
    .select({
      id: assistantStaffTable.id,
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
      roomBuilding:
        sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
    })
    .from(assistantStaffTable)
    .leftJoin(
      residentTable,
      eq(assistantStaffTable.residentId, residentTable.id)
    )
    .leftJoin(staffTable, eq(assistantStaffTable.staffId, staffTable.id))
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id));

  return ards;
}

export async function readRDsDropdown() {
  const rds = await db
    .select({
      id: staffTable.id,
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
    })
    .from(staffTable)
    .orderBy(asc(staffTable.lastName));

  return rds;
}

export async function readResidentsDropdown() {
  const rds = await db
    .select({
      id: residentTable.id,
      resident:
        sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
          "rd"
        ),
    })
    .from(residentTable)
    .orderBy(asc(residentTable.lastName));

  return rds;
}
