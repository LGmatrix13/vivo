import { sql, eq, desc, and } from "drizzle-orm";
import { CreatedEvent, UpdatedEvent } from "~/schemas/reports/event";
import { db } from "~/utilties/postgres.server";
import { formatDate } from "~/utilties/formatDate";
import {
  buildingTable,
  eventReportTable,
  readTable,
  staffTable,
} from "~/utilties/schema.server";
import { residentTable } from "~/utilties/schema.server";
import { zoneTable } from "~/utilties/schema.server";
type Values = { [key: string]: any };

/**
 * Reads the event reports submitted by all RAs
 */
export async function readEventReportsAdmin() {
  const data = await db.client
    .select({
      id: eventReportTable.id,
      time: eventReportTable.time,
      description: eventReportTable.description,
      attendance: eventReportTable.attendance,
      zoneId: eventReportTable.zoneId,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
    })
    .from(eventReportTable)
    .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, eventReportTable.id),
        eq(readTable.personType, "ADMIN"),
        eq(readTable.reportType, "EVENT")
      )
    )
    .orderBy(desc(eventReportTable.time));

  const formattedData = data.map((event) => {
    return {
      ...event,
      time: formatDate(event.time, true),
    };
  });

  return formattedData;
}

/**
 * Reads the event reports submitted by all RAs that work for a given RD
 */
export async function readEventReportsRD(id: number) {
  const data = await db.client
    .select({
      id: eventReportTable.id,
      time: eventReportTable.time,
      description: eventReportTable.description,
      attendance: eventReportTable.attendance,
      zoneId: eventReportTable.zoneId,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
    })
    .from(eventReportTable)
    .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .where(eq(staffTable.id, id))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, eventReportTable.id),
        eq(readTable.personType, "STAFF"),
        eq(readTable.reportType, "EVENT")
      )
    )
    .orderBy(desc(eventReportTable.time));

  const formattedData = data.map((event) => {
    return {
      ...event,
      time: formatDate(event.time, true),
    };
  });

  return formattedData;
}

/**
 * Reads the event reports submitted by a given RA
 */
export async function readEventReportsRA(id: number) {
  const data = await db.client
    .select({
      id: eventReportTable.id,
      time: eventReportTable.time,
      description: eventReportTable.description,
      attendance: eventReportTable.attendance,
      zoneId: eventReportTable.zoneId,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
    })
    .from(eventReportTable)
    //.innerJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .innerJoin(zoneTable, eq(eventReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .where(eq(zoneTable.id, id))
    .orderBy(desc(eventReportTable.time));

  const formattedData = data.map((event) => {
    return {
      ...event,
      time: formatDate(event.time, true),
    };
  });

  return formattedData;
}

/**
 * Creates a new event report in the database
 */
export async function createEvent(values: Values, request: Request) {
  return await db.insert(
    request,
    eventReportTable,
    CreatedEvent,
    values,
    true,
    {
      message: "Event Created",
      level: "success",
    }
  );
}

/**
 * Updates an event report in the database
 */
export async function updateEvent(values: Values, request: Request) {
  return db.update(
    request,
    eventReportTable,
    UpdatedEvent,
    values,
    (values) => eq(eventReportTable.id, values.id),
    {
      message: "Event Updated",
      level: "success",
    }
  );
}

/**
 * Deletes an event report from the database
 */
export async function deleteEvent(values: Values, request: Request) {
  return db.delete(
    request,
    eventReportTable,
    values,
    (id) => eq(eventReportTable.id, id),
    {
      message: "Event Deleted",
      level: "success",
    }
  );
}
