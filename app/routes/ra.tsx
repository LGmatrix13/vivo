import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import Header from "~/components/common/Header";
import {
  File,
  Chart,
  Door,
  Users,
  Clock,
  Settings,
} from "~/components/common/Icons";

export async function loader({ request }: LoaderFunctionArgs) {
  const ra = await auth.readUser(request, ["ra"]);
  return {
    ra,
  };
}

export default function AdminLayout() {
  const data = useLoaderData<typeof loader>();
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
      default: "/ra/people/residents",
      parent: "/ra/people/residents",
    },
    {
      name: "Settings",
      Icon: Settings,
      default: "/ra/settings",
      parent: "/ra/settings",
    },
  ];

  return (
    <>
      <Header root="/ra/shifts/on-duty" routes={routes} />
      <Outlet context={{ user: data.ra }} />
    </>
  );
}
