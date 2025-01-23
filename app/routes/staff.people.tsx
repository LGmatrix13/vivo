import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
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
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const buildingsDropdown = admin
    ? await readBuildingsDropdownAsAdmin()
    : await readBuildingsDropdownAsRD(user.id);
  return toast(request, {
    buildingsDropdown,
  });
}

export default function StaffPeopleLayout() {
  const context = useOutletContext<{
    user: IUser;
  }>();
  const admin = context.user.role === "admin";
  const data = useLoaderData<typeof loader>();
  const rdPages = [
    {
      name: "Residents",
      path: "/staff/people/residents",
    },
    {
      name: "RAs",
      path: "/staff/people/ras",
    },
    {
      name: "ARDs",
      path: "/staff/people/ards",
    },
  ];
  const adminPages = [
    ...rdPages,
    {
      name: "RDs",
      path: "/staff/people/rds",
    },
    {
      name: "Upload",
      path: "/staff/people/upload",
    },
  ];

  return (
    <>
      <SubHeader pages={admin ? adminPages : rdPages} />
      <main className="max-w-screen-2xl mx-auto px-7 mb-7">
        <Outlet context={data.extra.buildingsDropdown} />
        {data.toast && (
          <Toast level={data.toast.level}>{data.toast.message}</Toast>
        )}
      </main>
    </>
  );
}
