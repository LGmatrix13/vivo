import { eq } from "drizzle-orm";
import {
  CreatedUpperCampus,
  UpdatedUpperCampus,
  UpperCampusIssues,
} from "~/schemas/rcis/upperCampus";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import { RCITable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function createUpperCampus(request: Request, values: Values) {
  const result = CreatedUpperCampus.safeParse(values);
  const issues = UpperCampusIssues.safeParse(values);

  if (result.success && issues.success) {
    await db.client.insert(RCITable).values({
      roomId: result.data.roomId,
      issues: issues.data,
      status: "SUBMITTED_BY_RESIDENT",
    });

    return mutate(request.url, {
      message: "Saved Check-in form",
      level: "success",
    });
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}
export async function updateUpperCampus(request: Request, values: Values) {
  const result = UpdatedUpperCampus.safeParse(values);
  const issues = UpperCampusIssues.safeParse(values);

  if (result.success && issues.success) {
    await db.client
      .update(RCITable)
      .set({
        roomId: result.data.roomId,
        issues: issues.data,
        status: "SUBMITTED_BY_RESIDENT",
      })
      .where(eq(RCITable.id, result.data.id));

    return mutate(request.url, {
      message: "Saved Check-in form",
      level: "success",
    });
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}
