import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RCIForm from "~/components/forms/RCIForm";
import {
  colonialDoubleMapping,
  colonialQuadMapping,
  upperCampusMapping,
} from "~/mappings/rci";
import { createColonialDouble } from "~/repositories/rci/colonialDouble";
import { createColonialQuad } from "~/repositories/rci/colonialQuad";
import { createUpperCampus } from "~/repositories/rci/upperCampus";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);
  // const data = await db.client
  //   .select({
  //     roomType: roomTable.roomType,
  //     roomId: roomTable.id,
  //     issues: RCITable.issues,
  //   })
  //   .from(roomTable)
  //   .innerJoin(residentTable, eq(residentTable.roomId, roomTable.id))
  //   .innerJoin(RCITable, eq(roomTable.id, RCITable.id))
  //   .where(eq(residentTable.id, user.id));

  return json({
    roomType: "UPPER_CAMPUS",
    roomId: 1,
    issues: {},
  });
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
      return <RCIForm mapping={upperCampusMapping} roomId={data.roomId} />;
    case "APT_DOUBLE":
      return <RCIForm mapping={colonialDoubleMapping} roomId={data.roomId} />;
    case "APT_QUAD":
      return <RCIForm mapping={colonialQuadMapping} roomId={data.roomId} />;
  }
}
