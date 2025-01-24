import { json, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import Header from "~/components/common/Header";
import { Calendar, Door } from "~/components/common/Icons";

export async function loader({ request }: LoaderFunctionArgs) {
  const resident = await auth.readUser(request, ["resident"]);
  return json({
    resident,
  });
}

export default function AdminLayout() {
  const data = useLoaderData<typeof loader>();
  const routes = [
    {
      name: "On Duty",
      Icon: Calendar,
      default: "/resident/on-duty",
      parent: "/resident/on-duty",
    },
    {
      name: "Check-in",
      Icon: Door,
      default: "/resident/check-in",
      parent: "/resident/check-in",
    },
  ];
  const settings = {
    user: data.resident,
    path: "/resident/settings",
  };

  return (
    <>
      <Header root="/resident/on-duty" routes={routes} settings={settings} />
      <main className="max-w-screen-2xl mx-auto px-10 mb-7">
        <Outlet
          context={{
            user: data.resident,
          }}
        />
      </main>
    </>
  );
}
