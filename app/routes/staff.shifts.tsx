import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import Loading from "~/components/common/Loading";
import SubHeader from "~/components/common/SubHeader";
import { Toast } from "~/components/common/Toast";
import { IUser } from "~/models/user";
import { toast } from "~/utilties/toast.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Shifts" },
    {
      name: "Vivo: Shifts",
      content: "RA Shifts, RD Shifts, and On Duty",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return toast(request, {});
}

export default function StaffReportsLayout() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<{
    user: IUser;
  }>();
  const admin = context.user.role === "admin";
  const rdPages = [
    {
      name: "On Duty",
      path: "/staff/shifts/on-duty",
    },
    {
      name: "RA Shifts",
      path: "/staff/shifts/ra",
    },
    {
      name: "Upload",
      path: "/staff/shifts/upload",
    },
  ];
  const adminPages = [
    ...rdPages.slice(0, 2),
    {
      name: "RD Shifts",
      path: "/staff/shifts/rd",
    },
    {
      name: "Upload",
      path: "/staff/shifts/upload",
    },
  ];
  const { state } = useNavigation();

  return (
    <>
      <SubHeader pages={admin ? adminPages : rdPages} />
      <main className="max-w-screen-2xl mx-auto px-7 mb-7">
        {state == "loading" ? <Loading /> : <Outlet />}
        {data.toast && (
          <Toast level={data.toast.level}>{data.toast.message}</Toast>
        )}
      </main>
    </>
  );
}
