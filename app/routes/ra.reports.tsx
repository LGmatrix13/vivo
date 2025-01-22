import type { LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import SubHeader from "~/components/common/SubHeader";
import { Toast } from "~/components/common/Toast";
import { auth } from "~/utilties/auth.server";
import { toast } from "~/utilties/toast.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Reports" },
    {
      name: "Vivo: Reports",
      content: "Weekly, Round, Conversation, and Event",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  return toast(request, {});
}

export default function RAReportsLayout() {
  const data = useLoaderData<typeof loader>();
  const pages = [
    {
      name: "Weekly",
      path: "/ra/reports/weekly",
    },
    {
      name: "Round",
      path: "/ra/reports/round",
    },
    {
      name: "Conversation",
      path: "/ra/reports/conversation",
    },
    {
      name: "Event",
      path: "/ra/reports/event",
    },
  ];

  return (
    <>
      <SubHeader pages={pages} />
      <Outlet/>
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </>
  );
}
