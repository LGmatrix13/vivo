import { ActionFunctionArgs } from "@remix-run/node";
import ColonialRCIQuad from "~/components/forms/ColonialRCIQuadForm";
import { createUpperCampus } from "~/repositories/rci/upperCampus";
import { auth } from "~/utilties/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create.upperCampus":
      return await createUpperCampus(request, user.id, values);
    case "create.colonialDouble":
      // TODO: use a repo
      return null;
    case "create.colonialQuad":
      // TODO: use a repo
      return null;
  }
}

export default function ResidentCheckInPage() {
  return <UpperCampusRCI roomId={0} />;
}
