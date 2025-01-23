import { json, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import Header from "~/components/common/Header";
import { File, Chart, Users, Home, Clock } from "~/components/common/Icons";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  return json({
    user,
  });
}

export default function StaffLayout() {
  const data = useLoaderData<typeof loader>();
  const routes = [
    {
      name: "Shifts",
      Icon: Clock,
      default: "/staff/shifts/on-duty",
      parent: "/staff/shift",
    },
    {
      name: "Reports",
      Icon: File,
      default: "/staff/reports/weekly",
      parent: "/staff/reports",
    },
    {
      name: "Insights",
      Icon: Chart,
      default: "/staff/insights",
      parent: "/staff/insights",
    },
    {
      name: "People",
      Icon: Users,
      default: `/staff/people/residents`,
      parent: `/staff/people`,
    },
    {
      name: "Housing",
      Icon: Home,
      default: `/staff/housing/rooms`,
      parent: `/staff/housing`,
    },
  ];
  const settings = {
    user: data.user,
    path: "/staff/settings",
  };
  return (
    <>
      <Header
        root="/staff/shifts/on-duty"
        routes={routes}
        settings={settings}
      />
      <Outlet context={data} />
    </>
  );
}
