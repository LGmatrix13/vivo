import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RCIForm from "~/components/forms/RCIForm";
import {
  colonialDoubleMapping,
  colonialQuadMapping,
  upperCampusMapping,
} from "~/mappings/rci";
import { ISubmittedRCI } from "~/models/rci";
import {
  createColonialDouble,
  updateColonialDouble,
} from "~/repositories/rci/colonialDouble";
import {
  createColonialQuad,
  updateColonialQuad,
} from "~/repositories/rci/colonialQuad";
import { readSubmittedRCI } from "~/repositories/rci/complete";
import {
  createUpperCampus,
  updateUpperCampus,
} from "~/repositories/rci/upperCampus";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);
  const submittedRCI = await readSubmittedRCI(user.id);
  return json({
    submittedRCI,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["resident"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create.upperCampus":
      return await createUpperCampus(request, values);
    case "create.colonialDouble":
      return await createColonialDouble(request, values);
    case "create.colonialQuad":
      return await createColonialQuad(request, values);
    case "update.upperCampus":
      return await updateUpperCampus(request, values);
    case "update.colonialDouble":
      return await updateColonialDouble(request, values);
    case "update.colonialQuad":
      return await updateColonialQuad(request, values);
  }
}

export default function ResidentCheckInPage() {
  const data = useLoaderData<typeof loader>();
  const action = data.submittedRCI.id ? "update" : "create";

  switch (data.submittedRCI.roomType) {
    case "UPPER_CAMPUS":
      return (
        <RCIForm
          intent={`${action}.upperCampus`}
          mapping={upperCampusMapping}
          submittedRCI={data.submittedRCI as ISubmittedRCI}
        />
      );
    case "COLONIAL_DOUBLE":
      return (
        <RCIForm
          intent={`${action}.upperCampus`}
          mapping={colonialDoubleMapping}
          submittedRCI={data.submittedRCI as ISubmittedRCI}
        />
      );
    case "COLONIAL_QUAD":
      return (
        <RCIForm
          intent={`${action}.upperCampus`}
          mapping={colonialQuadMapping}
          submittedRCI={data.submittedRCI as ISubmittedRCI}
        />
      );
  }
}
