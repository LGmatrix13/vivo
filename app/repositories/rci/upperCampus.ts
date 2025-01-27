import { UpperCampus } from "~/schemas/rcis/upperCampus";
import { db } from "~/utilties/connection.server";
import mutate from "~/utilties/mutate.server";
import { RCITable } from "~/utilties/schema.server";

type Values = { [key: string]: any };

export async function createUpperCampus(
  request: Request,
  residentId: number,
  values: Values
) {
  const result = UpperCampus.safeParse(values);

  if (result.success) {
    const issues = result.data;
    await db.client.insert(RCITable).values({
      residentId,
      issues,
      status: "SUBMITTED_BY_RESIDENT",
      rciType: "UPPER_CAMPUS",
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
