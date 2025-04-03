import { LoaderFunctionArgs } from "@remix-run/node";
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
    { title: "Vivo: Housing" },
    { name: "Vivo: Housing", content: "Buildings and Rooms" },
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

export default function StaffHousingLayout() {
  const context = useOutletContext<{
    user: IUser;
  }>();
  const admin = context.user.role === "admin";
  const data = useLoaderData<typeof loader>();
  const rdPages = [
    {
      name: "Rooms",
      path: "/staff/housing/rooms",
    },
    {
      name: "Active\u00A0RCIs",
      path: "/staff/housing/rcis/active",
    },
    {
      name: "Checked\u2011out\u00A0RCIs",
      path: "/staff/housing/rcis/checked-out",
    },
    {
      name: "Incomplete\u00A0RCIs",
      path: "/staff/housing/rcis/incomplete",
    },
  ];
  const adminPages = [
    {
      name: "Buildings",
      path: "/staff/housing/buildings",
    },
    ...rdPages,
  ];

  const { state } = useNavigation();

  return (
    <>
      <SubHeader pages={admin ? adminPages : rdPages} />
      <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
        {state == "loading" ? (
          <Loading />
        ) : (
          <Outlet
            context={{
              buildingsDropdown: data.extra.buildingsDropdown,
            }}
          />
        )}
        {data.toast && (
          <Toast level={data.toast.level}>{data.toast.message}</Toast>
        )}
      </main>
    </>
  );
}
