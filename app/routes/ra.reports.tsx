import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import Loading from "~/components/common/Loading";
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

  const { state } = useNavigation();

  return (
    <>
      <SubHeader pages={pages} />
      <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
        {state == "loading" ? <Loading /> : <Outlet />}
        {data.toast && (
          <Toast level={data.toast.level}>{data.toast.message}</Toast>
        )}
      </main>
    </>
  );
}
