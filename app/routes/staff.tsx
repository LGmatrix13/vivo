import { json, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import Header from "~/components/common/Header";
import {
  File,
  Chart,
  Door,
  Users,
  Home,
  Clock,
} from "~/components/common/Icons";
import Loading from "~/components/common/Loading";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  return json({
    user,
  });
}

export default function StaffLayout() {
  const data = useLoaderData<typeof loader>();
  const admin = data.user.role === "admin";
  const { state } = useNavigation();

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
      name: "RCIs",
      Icon: Door,
      default: "/staff/rcis/complete",
      parent: "/staff/rcis",
    },
    {
      name: "People",
      Icon: Users,
      default: `/staff/people/residents`,
      parent: `/staff/people`,
    },
    {
      name: admin ? "Housing" : "Rooms",
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
      <main className="max-w-screen-2xl mx-auto px-10 mb-7">
        {state === "loading" ? <Loading /> : <Outlet context={data} />}
      </main>
    </>
  );
}
