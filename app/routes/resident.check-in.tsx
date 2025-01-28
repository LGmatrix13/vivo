import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import ColonialRCIDoubleForm from "~/components/forms/ColonialRCIDoubleForm";
import ColonialRCIQuadForm from "~/components/forms/ColonialRCIQuadForm";
import UpperCampusRCIForm from "~/components/forms/UpperCampusRCIForm";
import { createColonialDouble } from "~/repositories/rci/colonialDouble";
import { createColonialQuad } from "~/repositories/rci/colonialQuad";
import { createUpperCampus } from "~/repositories/rci/upperCampus";
import { auth } from "~/utilties/auth.server";
import { db } from "~/utilties/connection.server";
import { residentTable, roomTable } from "~/utilties/schema.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);
  const data = await db.client
    .select({
      roomType: roomTable.roomType,
      roomId: roomTable.id,
    })
    .from(roomTable)
    .innerJoin(residentTable, eq(residentTable.roomId, roomTable.id))
    .where(eq(residentTable.id, user.id));

  return json(data[0]);
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create.upperCampus":
      return createUpperCampus(request, user.id, values);
    case "create.colonialDouble":
      return createColonialDouble(request, user.id, values);
    case "create.colonialQuad":
      return createColonialQuad(request, user.id, values);
  }
}

export default function ResidentCheckInPage() {
  const data = useLoaderData<typeof loader>();

  switch (data.roomType) {
    case "UPPER_CAMPUS":
      return <UpperCampusRCIForm roomId={data.roomId} />;
    case "APT_DOUBLE":
      return <ColonialRCIDoubleForm roomId={data.roomId} />;
    case "APT_QUAD":
      return <ColonialRCIQuadForm roomId={data.roomId} />;
  }
}
