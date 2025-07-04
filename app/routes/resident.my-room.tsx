import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RCIProgress from "~/components/common/RCIProgress";
import RCIForm from "~/components/forms/RCIForm";
import { colonialQuadMapping, upperCampusMapping } from "~/mappings/rci";
import { ISubmittedRCI } from "~/models/rci";
import { createColonialDouble } from "~/repositories/rci/colonialDouble";
import { createColonialQuad } from "~/repositories/rci/colonialQuad";
import { readSubmittedRCI } from "~/repositories/rci/submitted";
import { createUpperCampus } from "~/repositories/rci/upperCampus";
import { auth } from "~/utilties/auth.server";
import { MetaFunction } from "@remix-run/node";
import Indication from "~/components/common/Indication";
import { Home } from "~/components/common/Icons";
import { getResidentRCIDraftData } from "~/repositories/rci/incomplete";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: My Room" },
    { name: "Vivo: My Room", content: "RCI management page" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);
  const submittedRCI = await readSubmittedRCI(user.id);
  const rciDraftData = await getResidentRCIDraftData(user.id);
  return {
    submittedRCI,
    rciDraftData
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);
  switch (intent) {
    case "create.upperCampus":
    case "update.upperCampus":
      return await createUpperCampus(request, user.id, values);
    case "create.colonialDouble":
    case "update.colonialDouble":
      return await createColonialDouble(request, user.id, values);
    case "create.colonialQuad":
    case "update.colonialQuad":
      return await createColonialQuad(request, user.id, values);
  }
}

export default function ResidentMyRoomPage() {
  const data = useLoaderData<typeof loader>();
  const action = data.submittedRCI.id ? "update" : "create";

  // Check out process
  const editable = data.submittedRCI.status === "RESIDENT_CHECKOUT" || data.submittedRCI.status === 'AWAITING_RESIDENT'

  if (data.submittedRCI.id && !editable) {
    return <RCIProgress />;
  }

  // Check in process
  switch (data.submittedRCI.roomType) {
    case "UPPER_CAMPUS":
      return (
        <RCIForm
          intent={`${action}.upperCampus`}
          mapping={upperCampusMapping}
          submittedRCI={(data.submittedRCI.id ? data.submittedRCI : data.rciDraftData) as ISubmittedRCI}
        />
      );
    case "COLONIAL_DOUBLE":
      return (
        <RCIForm
          intent={`${action}.colonialDouble`}
          mapping={upperCampusMapping}
          submittedRCI={(data.submittedRCI.id ? data.submittedRCI : data.rciDraftData) as ISubmittedRCI}
        />
      );
    case "COLONIAL_QUAD":
      return (
        <RCIForm
          intent={`${action}.colonialQuad`}
          mapping={colonialQuadMapping}
          submittedRCI={(data.submittedRCI.id ? data.submittedRCI : data.rciDraftData) as ISubmittedRCI}
        />
      );
    default:
      return (
        <Indication
          level="warning"
          title="You don't have a room"
          message="Looks like you are not assigned a room."
          Icon={Home}
        />
      );
  }
}
