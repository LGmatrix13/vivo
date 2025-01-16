import { sql, eq } from "drizzle-orm";
import { CreatedEvent, Event } from "~/schemas/reports/event";
import { db } from "~/utilties/connection.server";
import { formatDate } from "~/utilties/formatDate";
import {
  buildingTable,
  eventReportTable,
  staffTable,
} from "~/utilties/schema.server";
import { residentTable } from "~/utilties/schema.server";
import { zoneTable } from "~/utilties/schema.server";
type Values = { [key: string]: any };

export async function readEventReportsAdmin() {
  const data = await db.client
    .select({
      id: eventReportTable.id,
      time: sql<string>`TO_CHAR(${eventReportTable.time}, 'YYYY-MM-DD HH12:MI AM')`.as(
        "formattedTime"
      ),
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
    .orderBy(eventReportTable.time);

  const formattedData = data.map((event) => {
    return {
      ...event,
      time: formatDate(event.time, true),
    };
  });

  return formattedData;
}

export async function readEventReportsRD(id: number) {
  const data = await db.client
    .select({
      id: eventReportTable.id,
      time: sql<string>`TO_CHAR(${eventReportTable.time}, 'YYYY-MM-DD HH12:MI AM')`.as(
        "formattedTime"
      ),
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
    .where(eq(staffTable.id, id))
    .orderBy(eventReportTable.time);

  const formattedData = data.map((event) => {
    return {
      ...event,
      time: formatDate(event.time, true),
    };
  });

  return formattedData;
}

export async function readEventReportsRA(id: number) {
  const data = await db.client
    .select({
      id: eventReportTable.id,
      time: sql<string>`TO_CHAR(${eventReportTable.time}, 'YYYY-MM-DD HH12:MI AM')`.as(
        "formattedTime"
      ),
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
    .orderBy(eventReportTable.time);

  const formattedData = data.map((event) => {
    return {
      ...event,
      time: formatDate(event.time, true),
    };
  });

  return formattedData;
}

export async function createEvent(values: Values, request: Request) {
  return db.insert(request, eventReportTable, CreatedEvent, values, {
    message: "Event Created",
    level: "success",
  });
}

export async function updateEvent(values: Values, request: Request) {
  return db.update(
    request,
    eventReportTable,
    Event,
    values,
    (values) => eq(eventReportTable.id, values.id),
    {
      message: "Event Updated",
      level: "success",
    }
  );
}
