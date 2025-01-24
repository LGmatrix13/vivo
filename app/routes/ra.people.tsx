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
import {
  readBuildingsDropdownAsAdmin,
  readBuildingsDropdownAsRD,
} from "~/repositories/housing/buildings";
import { auth } from "~/utilties/auth.server";
import { toast } from "~/utilties/toast.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: People" },
    { name: "Vivo: People", content: "Residents, RAs, ARDS, and RDs" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return toast(request, {});
}

export default function StaffPeopleLayout() {
  const data = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
      {state == "loading" ? <Loading /> : <Outlet />}
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </main>
  );
}
