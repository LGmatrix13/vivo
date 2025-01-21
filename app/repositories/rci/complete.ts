import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { IRCIIssues } from "~/models/rci";
import { db } from "~/utilties/connection.server";
import { formatDate } from "~/utilties/formatDate";
import {
  buildingTable,
  RCITable,
  residentTable,
  roomTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";

export async function readCompleteRCIsAdmin() {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const data = await db.client
    .select({
      sentToLimble: RCITable.sentToLimble,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      building: buildingTable.name,
      status: RCITable.status,
      submittedOn: RCITable.submittedOn,
      buildingId: buildingTable.id,
      issues: sql<Object>`${RCITable.issues}`,
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .innerJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .orderBy(desc(RCITable.submittedOn));

  const formattedData = data.map((rci) => {
    return {
      ...rci,
      ...(rci.issues as IRCIIssues),
      totalIssues: Object.keys(rci.issues as IRCIIssues).length,
      submittedOn: formatDate(rci.submittedOn),
    };
  });
  return formattedData;
}

export async function readCompleteRCIsRD(id: number) {
  const raInfoTable = alias(residentTable, "raInfoTable");

  const data = await db.client
    .select({
      sentToLimble: RCITable.sentToLimble,
      resident: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
      ra: sql<string>`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`,
      room: sql<string>`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`,
      building: buildingTable.name,
      status: RCITable.status,
      submittedOn: RCITable.submittedOn,
      buildingId: buildingTable.id,
      issues: sql<Object>`${RCITable.issues}`,
    })
    .from(RCITable)
    .innerJoin(residentTable, eq(RCITable.residentId, residentTable.id))
    .innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .innerJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .innerJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .innerJoin(staffTable, eq(staffTable.id, buildingTable.staffId))
    .where(eq(staffTable.id, id))
    .orderBy(desc(RCITable.submittedOn));

  const formattedData = data.map((rci) => {
    return {
      ...rci,
      ...(rci.issues as IRCIIssues),
      totalIssues: Object.keys(rci.issues as IRCIIssues).length,
      submittedOn: formatDate(rci.submittedOn),
    };
  });
  return formattedData;
}
