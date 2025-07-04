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
      name: "Approve\u00A0Check\u2011in",
      path: "/ra/rcis/approve-check-in",
    },
    {
      name: "Active",
      path: "/ra/rcis/active",
    },
    {
      name: "Approve\u00A0Checkout",
      path: "/ra/rcis/approve-check-out",
    },
    {
      name: "Incomplete",
      path: "/ra/rcis/incomplete",
    },
    {
      name: "Personal\u00A0RCI",
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
