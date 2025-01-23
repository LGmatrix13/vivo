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
import {
  readBuildingsDropdownAsAdmin,
  readBuildingsDropdownAsRD,
} from "~/repositories/housing/buildings";
import { auth } from "~/utilties/auth.server";
import { toast } from "~/utilties/toast.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: RCIs" },
    {
      name: "Vivo: RCIs",
      content: "Incomplete and Complete RCIs",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const buildingsDropdown = admin
    ? await readBuildingsDropdownAsAdmin()
    : await readBuildingsDropdownAsRD(user.id);
  return toast(request, {
    buildingsDropdown,
  });
}

export default function StaffAdminReportsLayout() {
  const data = useLoaderData<typeof loader>();
  const pages = [
    {
      name: "Complete RCIs",
      path: "/staff/rcis/complete",
    },
    {
      name: "Incomplete RCIs",
      path: "/staff/rcis/incomplete",
    },
  ];
  const { state } = useNavigation();

  return (
    <>
      <SubHeader pages={pages} />
      <main className="max-w-screen-2xl mx-auto px-7 mb-7">
        {state == "loading" ? (
          <Loading />
        ) : (
          <Outlet context={data.extra.buildingsDropdown} />
        )}
        {data.toast && (
          <Toast level={data.toast.level}>{data.toast.message}</Toast>
        )}
      </main>
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </>
  );
}
