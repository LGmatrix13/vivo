import {
  ColonialDoubleIssues,
  UpsertedColonialDouble,
} from "~/schemas/rcis/colonialDouble";
import { db } from "~/utilties/postgres.server";
import mutate from "~/utilties/mutate.server";
import { RCITable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function createColonialDouble(
  request: Request,
  residentId: number,
  values: Values
) {
  const result = UpsertedColonialDouble.safeParse(values);
  const issues = ColonialDoubleIssues.safeParse(values);

  if (result.success && issues.success) {
    await db.client
      .insert(RCITable)
      .values({
        residentId,
        id: result.data.id,
        issues: issues.data,
        status: "AWAITING_RA",
      })
      .onConflictDoUpdate({
        target: RCITable.id,
        set: {
          residentId,
          checkoutIssues: issues.data,
          status: "RA_CHECKOUT"
        }
      });

    return mutate(request.url, {
      message: "Saved RCI",
      level: "success",
    });
  }

  return mutate(request.url, {
    message: "System error occured",
    level: "failure",
  });
}
