import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import Loading from "~/components/common/Loading";
import SubHeader from "~/components/common/SubHeader";
import { Toast } from "~/components/common/Toast";
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

export default function AdminPeopleLayout() {
  const { state } = useNavigation();
  const data = useLoaderData<typeof loader>();

  console.log(data);
  if (state !== "idle") {
    return <Loading />;
  }

  return (
    <>
      <SubHeader
        pages={[
          {
            name: "Residents",
            path: "/admin/people/residents",
          },
          {
            name: "RAs",
            path: "/admin/people/ras",
          },
          {
            name: "ARDs",
            path: "/admin/people/ards",
          },
          {
            name: "RDs",
            path: "/admin/people/rds",
          },
        ]}
      />
      <Outlet />
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </>
  );
}
