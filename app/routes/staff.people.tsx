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
import { readBuildingsDropdown } from "~/repositories/housing/buildings";
import { toast } from "~/utilties/toast.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: People" },
    { name: "Vivo: People", content: "Residents, RAs, ARDS, and RDs" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const buildingsDropdown = await readBuildingsDropdown();
  return toast(request, {
    buildingsDropdown,
  });
}

export default function StaffAdminPeopleLayout() {
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
      <SubHeader pages={adminPages} />
      <Outlet context={data.extra.buildingsDropdown} />
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </>
  );
}
