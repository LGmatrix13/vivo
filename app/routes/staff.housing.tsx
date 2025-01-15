import { json, LoaderFunctionArgs } from "@remix-run/node";
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
import { toasts } from "~/utilties/mutate.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Housing" },
    { name: "Vivo: Housing", content: "Buildings and Rooms" },
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

export default function AdminHousingLayout() {
  const context = useOutletContext();
  const data = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  if (state !== "idle") {
    return <Loading />;
  }

  return (
    <>
      <div className="mb-5">
        <SubHeader
          pages={[
            {
              name: "Buildings",
              path: "/staff/housing/buildings",
            },
            {
              name: "Rooms",
              path: "/staff/housing/rooms",
            },
          ]}
        />
      </div>
      <Outlet context={context} />
      {data.toast && (
        <Toast level={data.toast.level}>{data.toast.message}</Toast>
      )}
    </>
  );
}
