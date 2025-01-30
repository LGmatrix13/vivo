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
import { createColonialDouble } from "~/repositories/rci/colonialDouble";
import { createColonialQuad } from "~/repositories/rci/colonialQuad";
import { readSubmittedRCI } from "~/repositories/rci/complete";
import { createUpperCampus } from "~/repositories/rci/upperCampus";
import { auth } from "~/utilties/auth.server";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Check-In" },
    { name: "Vivo: Check-In", content: "Check-in page" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);
  const submittedRCI = await readSubmittedRCI(user.id);
  return json({
    submittedRCI,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create.upperCampus":
      return await createUpperCampus(request, user.id, values);
    case "create.colonialDouble":
      return await createColonialDouble(request, user.id, values);
    case "create.colonialQusad":
      return await createColonialQuad(request, user.id, values);
  }
}

export default function ResidentCheckInPage() {
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
