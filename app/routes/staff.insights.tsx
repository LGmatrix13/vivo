import { LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import { name } from "node_modules/@azure/msal-browser/dist/packageMetadata";
import Loading from "~/components/common/Loading";
import SubHeader from "~/components/common/SubHeader";
import { Toast } from "~/components/common/Toast";
import { IUser } from "~/models/user";
import { toast } from "~/utilties/toast.server";

export const meta: MetaFunction = () => {
  return [{ title: "Vivo: Insights" }, { name: "Vivo: Insights", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return toast(request, {});
}

export default function StaffInsightsLayout() {
  const context = useOutletContext<{
    user: IUser;
  }>();
  const data = useLoaderData<typeof loader>();
  const pages = [
    {
      name: "Reports",
      path: "/staff/insights/reports",
    },
    {
      name: "RCIs",
      path: "/staff/insights/rcis",
    },
    {
      name: "Shifts",
      path: "/staff/insights/shifts",
    },
    {
      name: "Ask Merrick",
      path: "/staff/merrick",
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
