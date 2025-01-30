import { json, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import Header from "~/components/common/Header";
import { Calendar, Door } from "~/components/common/Icons";
import { toast } from "~/utilties/toast.server";
import Loading from "~/components/common/Loading";
import { Toast } from "~/components/common/Toast";

export async function loader({ request }: LoaderFunctionArgs) {
  const resident = await auth.readUser(request, ["resident"]);
  return toast(request, {
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
    user: data.extra.resident,
    path: "/resident/settings",
  };
  const { state } = useNavigation();

  return (
    <>
      <Header root="/resident/on-duty" routes={routes} settings={settings} />
      <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
        {state == "loading" ? (
          <Loading />
        ) : (
          <Outlet context={{ user: data.extra.resident }} />
        )}
        {data.toast && (
          <Toast level={data.toast.level}>{data.toast.message}</Toast>
        )}
      </main>
    </>
  );
}
