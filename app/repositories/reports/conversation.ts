import { sql, eq, and, aliasedTable } from "drizzle-orm";
import {
  Conversation,
  CreatedConversation,
} from "~/schemas/reports/conversation";
import { db } from "~/utilties/postgres.server";
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

/**
 * Reads the conversation reports submitted by all RAs
 */
export async function readConversationReports() {
  const raTable = aliasedTable(residentTable, "ra"); // Alias residentTable for RA

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
      resident: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`,
      ra: sql<string>`${raTable.firstName} || ' ' || ${raTable.lastName}`,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`,
      buildingId: buildingTable.id,
    })
    .from(consverationReportTable)
    .innerJoin(zoneTable, eq(consverationReportTable.zoneId, zoneTable.id))
    .innerJoin(raTable, eq(zoneTable.residentId, raTable.id)) // Join RA alias instead of staffTable
    .innerJoin(buildingTable, eq(raTable.id, buildingTable.staffId)) // Ensure correct join with buildingTable
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    ) // Regular join for resident
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
      time: formatDate(event.submitted, true),
    };
  });

  return formattedData;
}

/**
 * Reads the conversation reports submitted by all RAs that work for a given RD
 */
export async function readConversationReportsAsRD(id: number) {
  const raTable = aliasedTable(residentTable, "ra"); // Alias residentTable for RA

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
      resident: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`,
      ra: sql<string>`${raTable.firstName} || ' ' || ${raTable.lastName}`,
      read: sql<boolean>`CASE WHEN ${readTable.reportId} IS NOT NULL THEN TRUE ELSE FALSE END`,
      buildingId: buildingTable.id,
    })
    .from(consverationReportTable)
    //add inner joins here
    .innerJoin(zoneTable, eq(consverationReportTable.zoneId, zoneTable.id))
    .innerJoin(staffTable, eq(zoneTable.staffId, staffTable.id))
    .innerJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .innerJoin(raTable, eq(raTable.id, zoneTable.residentId))
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    )
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
      time: formatDate(event.submitted, true),
    };
  });

  return formattedData;
}

/**
 * Reads the conversation reports submitted by a given RA
 */
export async function readConversationReportsAsRA(id: number) {
  const data = await db.client
    .select({
      id: consverationReportTable.id,
      residentId: consverationReportTable.residentId,
      resident: sql<string>`${residentTable.firstName} || ' ' || ${residentTable.lastName}`,
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
    .innerJoin(
      residentTable,
      eq(residentTable.id, consverationReportTable.residentId)
    )
    .where(eq(zoneTable.id, id))
    .orderBy(consverationReportTable.submitted);

  const formattedData = data.map((conversation) => {
    return {
      ...conversation,
      highPriority: conversation.highPriority ? "Yes" : "No",
      submitted: formatDate(conversation.submitted, true),
    };
  });

  return formattedData;
}

/**
 * Creates a new conversation report in the database
 */
export async function createConversation(values: Values, request: Request) {
  return await db.insert(
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

/**
 * Updates a conversation report in the database
 */
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

/**
 * Deletes a conversation report from the database
 */
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
