import { MetaFunction, Outlet, useNavigation } from "@remix-run/react";
import Loading from "~/components/common/Loading";

export const meta: MetaFunction = () => {
  return [{ title: "Vivo: Insights" }, { name: "Vivo: Insights", content: "" }];
};

export default function StaffInsightsLayout() {
  const { state } = useNavigation();

  return (
    <>
      <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
        {state == "loading" ? <Loading /> : <Outlet />}
      </main>
    </>
  );
}
