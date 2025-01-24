import { Conversation } from "~/schemas/reports/conversation";
import { ReadReport } from "~/schemas/reports/readReport";
import { db } from "~/utilties/connection.server";
import { readTable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function createReadReport(values: Values, request: Request) {
  return db.insert(request, readTable, ReadReport, values, false);
}
