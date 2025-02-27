import { sql, eq, and } from "drizzle-orm";
import {
  Conversation,
  CreatedConversation,
} from "~/schemas/reports/conversation";
import { db } from "~/utilties/connection.server";
import { formatDate } from "~/utilties/formatDate";
import {
  buildingTable,
  staffTable,
  consverationReportTable,
  readTable,
} from "~/utilties/schema.server";
import { residentTable } from "~/utilties/schema.server";
import { zoneTable } from "~/utilties/schema.server";
type Values = { [key: string]: any };

export async function readConversationReports() {
  const data = await db.client
    .select({
      id: consverationReportTable.id,
      residentId: consverationReportTable.residentId,
      submitted: consverationReportTable.submitted,
      explanation: consverationReportTable.explanation,
      level: consverationReportTable.level,
      zoneId: consverationReportTable.zoneId,
      sentiment: consverationReportTable.sentiment,
      highPriority: consverationReportTable.highPriority,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
      buildingId: buildingTable.id,
    })
    .from(consverationReportTable)
    .innerJoin(zoneTable, eq(consverationReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, consverationReportTable.id),
        eq(readTable.personType, "ADMIN"),
        eq(readTable.reportType, "CONVERSATION")
      )
    )
    .orderBy(consverationReportTable.submitted);

  const formattedData = data.map((event) => {
    return {
      ...event,
      time: formatDate(event.submitted.toDateString(), true),
    };
  });

  return formattedData;
}

export async function readConversationReportsAsRD(id: number) {
  const data = await db.client
    .select({
      id: consverationReportTable.id,
      residentId: consverationReportTable.residentId,
      submitted: consverationReportTable.submitted,
      explanation: consverationReportTable.explanation,
      level: consverationReportTable.level,
      zoneId: consverationReportTable.zoneId,
      sentiment: consverationReportTable.sentiment,
      highPriority: consverationReportTable.highPriority,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`.as(
        "read"
      ),
      buildingId: buildingTable.id,
    })
    .from(consverationReportTable)
    //add inner joins here
    .innerJoin(zoneTable, eq(consverationReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .leftJoin(
      readTable,
      and(
        eq(readTable.reportId, consverationReportTable.id),
        eq(readTable.personType, "STAFF"),
        eq(readTable.reportType, "CONVERSATION")
      )
    )
    .where(eq(staffTable.id, id))
    .orderBy(consverationReportTable.submitted);

  const formattedData = data.map((event) => {
    return {
      ...event,
      time: formatDate(event.submitted.toDateString(), true),
    };
  });

  return formattedData;
}

export async function readConversationReportsAsRA(id: number) {
  const data = await db.client
    .select({
      id: consverationReportTable.id,
      residentId: consverationReportTable.residentId,
      submitted: consverationReportTable.submitted,
      explanation: consverationReportTable.explanation,
      level: consverationReportTable.level,
      zoneId: consverationReportTable.zoneId,
      sentiment: consverationReportTable.sentiment,
      highPriority: consverationReportTable.highPriority,
      ra: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`.as(
        "raName"
      ),
      buildingId: buildingTable.id,
    })
    .from(consverationReportTable)
    //add inner joins here
    .innerJoin(zoneTable, eq(consverationReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .where(eq(zoneTable.id, id))
    .orderBy(consverationReportTable.submitted);

  const formattedData = data.map((conversation) => {
    return {
      ...conversation,
      highPriority: conversation.highPriority ? "Yes" : "No",
      submitted: formatDate(conversation.submitted.toDateString(), true),
    };
  });

  return formattedData;
}

export async function createConversation(values: Values, request: Request) {
  return db.insert(
    request,
    consverationReportTable,
    CreatedConversation,
    values,
    true,
    {
      message: "Conversation Created",
      level: "success",
    }
  );
}

export async function updateConversation(values: Values, request: Request) {
  return db.update(
    request,
    consverationReportTable,
    Conversation,
    values,
    (values) => eq(consverationReportTable.id, values.id),
    {
      message: "Conversation Created",
      level: "success",
    }
  );
}

export async function deleteConversation(values: Values, request: Request) {
  return db.delete(
    request,
    consverationReportTable,
    values,
    (id) => eq(consverationReportTable.id, id),
    {
      message: "Conversation Deleted",
      level: "success",
    }
  );
}
