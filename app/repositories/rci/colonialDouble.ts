import {
  ColonialDoubleIssues,
  CreatedColonialDouble,
} from "~/schemas/rcis/colonialDouble";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import { RCITable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function createColonialDouble(request: Request, values: Values) {
  const result = CreatedColonialDouble.safeParse(values);
  console.log(result.error);
  const issues = ColonialDoubleIssues.safeParse(values);
  console.log(result.error);

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
