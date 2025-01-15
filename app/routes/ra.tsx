import { json, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import Header from "~/components/common/Header";
import { File, Chart, Door, Users, Clock } from "~/components/common/Icons";
import Loading from "~/components/common/Loading";

export async function loader({ request }: LoaderFunctionArgs) {
  const ra = await auth.readUser(request, ["ra"]);
  return json({
    ra,
  });
}

export default function AdminLayout() {
  const data = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  const routes = [
    {
      name: "Shifts",
      Icon: Clock,
      default: "/ra/shifts/on-duty",
      parent: "/ra/shifts",
    },
    {
      name: "Reports",
      Icon: File,
      default: "/ra/reports/weekly",
      parent: "/ra/reports",
    },
    {
      name: "Insights",
      Icon: Chart,
      default: "/ra/insights",
      parent: "/ra/insights",
    },
    {
      name: "RCIs",
      Icon: Door,
      default: "/ra/rcis/complete",
      parent: "/ra/rcis",
    },
    {
      name: "Residents",
      Icon: Users,
      default: "/ra/residents",
      parent: "/ra/residents",
    },
  ];

  const settings = {
    user: data.ra,
    path: "/ra/settings",
  };

  return (
    <>
      <Header root="/ra/shifts/on-duty" routes={routes} settings={settings} />
      <main className="max-w-screen-2xl mx-auto px-10 mb-7">
        {state !== "idle" ? (
          <Loading />
        ) : (
          <Outlet context={{ user: data.ra }} />
        )}
      </main>
    </>
  );
}
