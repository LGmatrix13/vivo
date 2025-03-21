import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import Loading from "~/components/common/Loading";
import SubHeader from "~/components/common/SubHeader";
import { Toast } from "~/components/common/Toast";
import { toast } from "~/utilties/toast.server";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: RCIs" },
    { name: "Vivo: RCIs", content: "RCIs for your hall" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return toast(request, {});
}

export default function RARCIsLayout() {
  const data = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  const pages = [
    {
      name: "Awaiting Approval",
      path: "/ra/rcis/awaiting-approval",
    },
    {
      name: "Active",
      path: "/ra/rcis/active",
    },
    {
      name: "Incomplete",
      path: "/ra/rcis/incomplete",
    },
    {
      name: "Personal RCI",
      path: "/ra/rcis/personal",
    },
  ];

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
