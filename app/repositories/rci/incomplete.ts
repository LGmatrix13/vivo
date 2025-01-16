import { and, asc, eq, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/utilties/connection.server";
import {
  buildingTable,
  RCITable,
  residentTable,
  roomTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";

export async function readIncompleteRCIsAsAdmin() {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const data = await db.client
    .select({
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      buildingId: buildingTable.id,
    })
    .from(residentTable)
    .where(
      notExists(
        db.client
          .select()
          .from(RCITable)
          .where(eq(RCITable.residentId, residentTable.id))
      )
    )
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(zoneTable.id, roomTable.zoneId))
    .innerJoin(raInfoTable, eq(raInfoTable.id, zoneTable.residentId))
    .orderBy(asc(residentTable.lastName));
  return data;
}

export async function readIncompleteRCIsAsRD(id: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const data = await db.client
    .select({
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      buildingId: buildingTable.id,
    })
    .from(residentTable)
    .where(
      and(
        notExists(
          db.client
            .select()
            .from(RCITable)
            .where(eq(RCITable.residentId, residentTable.id))
        ),
        eq(staffTable.id, id)
      )
    )
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(zoneTable.id, roomTable.zoneId))
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .innerJoin(raInfoTable, eq(raInfoTable.id, zoneTable.residentId))
    .orderBy(asc(residentTable.lastName));
  return data;
}
