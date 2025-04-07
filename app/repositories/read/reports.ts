import { ReadReport } from "~/schemas/reports/readReport";
import { db } from "~/utilties/postgres.server";
import { readTable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

/**
 * Creates a new record in the database for a report
 */
export async function createReadReport(values: Values, request: Request) {
  return await db.insert(request, readTable, ReadReport, values, false);
}
