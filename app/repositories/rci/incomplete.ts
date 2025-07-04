import { and, desc, eq, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/utilties/postgres.server";
import {
  buildingTable,
  RCITable,
  residentTable,
  roomTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";

/**
 * Returns all residents that have not completed an RCI
 */
export async function readIncompleteRCIsAsAdmin() {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const innerRoomTable = alias(roomTable, "innerRoomTable");
  const data = await db.client
    .select({
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      roomId: roomTable.id,
      roomType: roomTable.roomType,
      buildingId: buildingTable.id,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
    })
    .from(roomTable)
    .where(
      notExists(
        db.client
          .select({ id: RCITable.id })
          .from(RCITable)
          .innerJoin(residentTable, eq(residentTable.id, RCITable.residentId))
          .innerJoin(
            innerRoomTable,
            eq(residentTable.roomId, innerRoomTable.id)
          )
          .where(eq(roomTable.id, innerRoomTable.id))
      )
    )
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(zoneTable.id, roomTable.zoneId))
    .innerJoin(raInfoTable, eq(raInfoTable.id, zoneTable.residentId))
    .innerJoin(residentTable, eq(residentTable.roomId, roomTable.id));

  return data;
}

/**
 * Returns all residents that have not completed an RCI on a given RA's hall
 */
export async function readIncompleteRCIsAsRA(zoneId: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const innerRoomTable = alias(roomTable, "innerRoomTable");
  const data = await db.client
    .select({
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      buildingId: buildingTable.id,
      roomId: roomTable.id,
      roomType: roomTable.roomType,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
    })
    .from(roomTable)
    .where(
      and(
        notExists(
          db.client
            .select({ id: RCITable.id })
            .from(RCITable)
            .innerJoin(residentTable, eq(residentTable.id, RCITable.residentId))
            .innerJoin(
              innerRoomTable,
              eq(residentTable.roomId, innerRoomTable.id)
            )
            .where(eq(roomTable.id, innerRoomTable.id))
        ),
        eq(roomTable.zoneId, zoneId)
      )
    )
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(zoneTable.id, roomTable.zoneId))
    .innerJoin(raInfoTable, eq(raInfoTable.id, zoneTable.residentId))
    .innerJoin(residentTable, eq(residentTable.roomId, roomTable.id));

  return data;
}

/**
 * Returns all residents that have not completed an RCI for a given RD
 */
export async function readIncompleteRCIsAsRD(id: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const innerRoomTable = alias(roomTable, "innerRoomTable");

  const data = await db.client
    .select({
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      roomId: roomTable.id,
      roomType: roomTable.roomType,
      buildingId: buildingTable.id,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
    })
    .from(roomTable)
    .where(
      and(
        notExists(
          db.client
            .select({ id: RCITable.id })
            .from(RCITable)
            .innerJoin(residentTable, eq(residentTable.id, RCITable.residentId))
            .innerJoin(
              innerRoomTable,
              eq(residentTable.roomId, innerRoomTable.id)
            )
            .where(eq(roomTable.id, innerRoomTable.id))
        ),
        eq(staffTable.id, id)
      )
    )
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(zoneTable.id, roomTable.zoneId))
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .innerJoin(raInfoTable, eq(raInfoTable.id, zoneTable.residentId))
    .innerJoin(residentTable, eq(residentTable.roomId, roomTable.id))
    .orderBy(desc(roomTable.id));

  return data;
}

/**
 * Gets the RCI draft information in JSON format for a given resident's room
 */
export async function getResidentRCIDraftData(residentId: number) {
  const data = await db.client
    .select({
      issues: roomTable.issuesRCI || {},
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .where(eq(residentTable.id, residentId));

  if (data.length == 0) {
    return {
      issues: {} as Record<string, string>,
    };
  }

  return {
    issues: data[0].issues as Record<string, string>,
  };
}

/**
 * Gets the RCI draft information in JSON format for a given RA's room
 */
export async function getRAPersonalRCIDraftData(zoneId: number) {
  const data = await db.client
    .select({
      issues: roomTable.issuesRCI || {},
    })
    .from(zoneTable)
    .leftJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .where(eq(zoneTable.id, zoneId));

  if (data.length == 0) {
    return {
      issues: {} as Record<string, string>,
    };
  }

  return {
    issues: data[0].issues as Record<string, string>,
  };
}
