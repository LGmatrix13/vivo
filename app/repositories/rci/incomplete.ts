import { and, asc, desc, eq, notExists, sql } from "drizzle-orm";
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
  const innerRoomTable = alias(roomTable, "innerRoomTable");
  const data = await db.client
    .select({
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      buildingId: buildingTable.id,
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
    .innerJoin(raInfoTable, eq(raInfoTable.id, zoneTable.residentId));

  return data;
}

export async function readIncompleteRCIsAsRD(id: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");
  const innerRoomTable = alias(roomTable, "innerRoomTable");

  const data = await db.client
    .select({
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      buildingId: buildingTable.id,
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
    .orderBy(desc(roomTable.id));

  return data;
}
