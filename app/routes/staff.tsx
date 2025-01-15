import { Outlet, redirect, useNavigation } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import Header from "~/components/common/Header";
import Loading from "~/components/common/Loading";
import {
  Chart,
  Clock,
  Door,
  Home,
  Users,
  File,
} from "~/components/common/Icons";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await auth.cookie.parse(cookieHeader);
  if (!cookie) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await auth.cookie.serialize(""),
      },
    });
  }
  const decodedJwt = await auth.decodeJWT(cookie, "admin");
  if (!decodedJwt) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await auth.cookie.serialize(""),
      },
    });
  }
  return decodedJwt;
}

export default function StaffLayout() {
  // todo: do a auth check to what role (admin or rd)
  const admin = true;
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
    user: null,
    path: "/staff/settings",
  };
  return (
    <>
      <Header
        root="/staff/shifts/on-duty"
        routes={routes}
        settings={{
          user: {
            id: 1,
            name: "Ethan",
            email: "ethankesterholt21@gcc.edu",
            role: "admin",
          },
          path: "/staff/settings",
        }}
      />
      <main className="max-w-screen-2xl mx-auto px-10 mb-7">
        {state !== "idle" ? <Loading /> : <Outlet />}
      </main>
    </>
  );
}
