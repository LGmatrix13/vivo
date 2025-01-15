import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, Upload } from "~/components/common/Icons";
import Loading from "~/components/common/Loading";
import SubHeader from "~/components/common/SubHeader";
import { Toast } from "~/components/common/Toast";
import UploadMasterCSVForm from "~/components/forms/UploadMasterCSVForm";
import { createARD, updateARD, deleteARD } from "~/repositories/people/ards";
import { uploadMasterCSV } from "~/repositories/people/ras";
import { csv } from "~/utilties/csv";
import { toasts } from "~/utilties/mutate.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: People" },
    { name: "Vivo: People", content: "Residents, RAs, ARDS, and RDs" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = await request.headers.get("Cookie");
  const cookie = await toasts.parse(cookieHeader);

  if (cookie) {
    const newCookie = await toasts.serialize("");

    return json(
      {
        toast: cookie,
      },
      {
        headers: {
          "Set-Cookie": newCookie,
        },
      }
    );
  }

  return json({
    toast: null,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "upload":
      return await uploadMasterCSV(values, request);
  }
}

export default function AdminPeopleLayout() {
  const { state } = useNavigation();
  const data = useLoaderData<typeof loader>();

  console.log(data);
  if (state !== "idle") {
    return <Loading />;
  }

  return (
    <>
      <div className="flex mb-5">
        <SubHeader
          pages={[
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
            {
              name: "RDs",
              path: "/staff/people/rds",
            },
          ]}
        />
        <div className="ml-auto order-1 flex space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <UploadMasterCSVForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Upload}>Upload from CSV</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <a href="/template.csv">
            <IconButton Icon={Download}>Download Template</IconButton>
          </a>
        </div>
      </div>
      <Outlet />
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </>
  );
}
