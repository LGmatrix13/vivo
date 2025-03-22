import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RCIProgress from "~/components/common/RCIProgress";
import RCIForm from "~/components/forms/RCIForm";
import {
  colonialDoubleMapping,
  colonialQuadMapping,
  upperCampusMapping,
} from "~/mappings/rci";
import { ISubmittedRCI } from "~/models/rci";
import { readResidentIdAsRA } from "~/repositories/people/ras";
import { createColonialDouble } from "~/repositories/rci/colonialDouble";
import { createColonialQuad } from "~/repositories/rci/colonialQuad";
import { getRAPersonalRCIDraftData } from "~/repositories/rci/incomplete";
import { readSubmittedRCIAsRA } from "~/repositories/rci/submitted";
import { createUpperCampus } from "~/repositories/rci/upperCampus";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const submittedRCI = await readSubmittedRCIAsRA(user.id);
  const rciDraftData = await getRAPersonalRCIDraftData(user.id);
  return {
    submittedRCI,
    rciDraftData
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);
  const { residentId } = await readResidentIdAsRA(user.id);
  switch (intent) {
    case "create.upperCampus":
      return await createUpperCampus(request, residentId, values);
    case "create.colonialDouble":
      return await createColonialDouble(request, residentId, values);
    case "create.colonialQusad":
      return await createColonialQuad(request, residentId, values);
  }
}

export default function RARCIsPersonalPage() {
  const data = useLoaderData<typeof loader>();
  const action = data.submittedRCI.id ? "update" : "create";

  if (data.submittedRCI.id) {
    return <RCIProgress />;
  }

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
          intent={`${action}.upperCampus`}
          mapping={colonialDoubleMapping}
          submittedRCI={(data.submittedRCI.id ? data.submittedRCI : data.rciDraftData) as ISubmittedRCI}
        />
      );
    case "COLONIAL_QUAD":
      return (
        <RCIForm
          intent={`${action}.upperCampus`}
          mapping={colonialQuadMapping}
          submittedRCI={(data.submittedRCI.id ? data.submittedRCI : data.rciDraftData) as ISubmittedRCI}
        />
      );
  }
}
