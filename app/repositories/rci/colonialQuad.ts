import {
  ColonialQuadIssues,
  CreatedColonialQuad,
} from "~/schemas/rcis/colonialQuad";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import { RCITable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function createColonialQuad(
  request: Request,
  roomId: number,
  values: Values
) {
  const result = CreatedColonialQuad.safeParse(values);
  const issues = ColonialQuadIssues.safeParse(values);

  if (result.success && issues.success) {
    await db.client.insert(RCITable).values({
      roomId,
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
