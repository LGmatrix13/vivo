import { LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import Loading from "~/components/common/Loading";
import { Toast } from "~/components/common/Toast";
import { toast } from "~/utilties/toast.server";

export const meta: MetaFunction = () => {
  return [{ title: "Vivo: Insights" }, { name: "Vivo: Insights", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return toast(request, {});
}

export default function RAInsightsLayout() {
  const data = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <>
      <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
        {state == "loading" ? <Loading /> : <Outlet />}
      </main>
    </>
  );
}
