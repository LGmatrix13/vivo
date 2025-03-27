import {
  ColonialQuadIssues,
  CreatedColonialQuad,
} from "~/schemas/rcis/colonialQuad";
import { db } from "~/utilties/postgres.server";
import mutate from "~/utilties/mutate.server";
import { RCITable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function createColonialQuad(
  request: Request,
  residentId: number,
  values: Values
) {
  const result = CreatedColonialQuad.safeParse(values);
  const issues = ColonialQuadIssues.safeParse(values);

  if (result.success && issues.success) {
    await db.client.insert(RCITable).values({
      residentId,
      issues: issues.data,
      status: "AWAITING_RA",
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
