import { LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  Outlet,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import Loading from "~/components/common/Loading";
import { IUser } from "~/models/user";
import { toast } from "~/utilties/toast.server";

export const meta: MetaFunction = () => {
  return [{ title: "Vivo: Insights" }, { name: "Vivo: Insights", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return toast(request, {});
}

export default function RAInsightsLayout() {
  const { state } = useNavigation();
  const context = useOutletContext<{
    user: IUser;
  }>();
  return (
    <>
      <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
        {state == "loading" ? <Loading /> : <Outlet context={context} />}
      </main>
    </>
  );
}
