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

export default function RAShiftsLayout() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<{
    user: IUser;
  }>();
  const raPages = [
    {
      name: "On\u00A0Duty",
      path: "/ra/shifts/on-duty",
    },
    {
      name: "RA\u00A0Shifts",
      path: "/ra/shifts/schedule",
    },
  ];
  const { state } = useNavigation();

  return (
    <>
      <SubHeader pages={raPages} />
      <main className="max-w-screen-2xl mx-auto px-10 mb-7">
        {state == "loading" ? <Loading /> : <Outlet />}
        {data.toast && (
          <Toast level={data.toast.level}>{data.toast.message}</Toast>
        )}
      </main>
    </>
  );
}
