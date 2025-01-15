import type { LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
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
    { title: "Vivo: Reports" },
    {
      name: "Vivo: Reports",
      content: "Weekly, Round, Conversation, and Event",
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

export default function StaffReportsLayout() {
  const data = useLoaderData<typeof loader>();
  const pages = [
    {
      name: "Weekly",
      path: "/staff/reports/weekly",
    },
    {
      name: "Round",
      path: "/staff/reports/round",
    },
    {
      name: "Conversation",
      path: "/staff/reports/conversation",
    },
    {
      name: "Event",
      path: "/staff/reports/event",
    },
  ];

  return (
    <>
      <SubHeader pages={pages} />
      <Outlet context={data.extra.buildingsDropdown} />
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </>
  );
}
