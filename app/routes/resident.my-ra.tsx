import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RAInfo from "~/components/common/RAInfo";
import { myRA } from "~/repositories/people/residents";
import { auth } from "~/utilties/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: My RA" },
    { name: "Vivo: My RA", content: "My RA's info page" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["resident"]);
  const ra = await myRA(user.id);
  return {
    ra
  };
}

export default function ResidentMyRAPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <h2 className="font-bold text-lg">My RA</h2>
          <RAInfo ra={data.ra}/>
      </div>
    </section>
  );
}
