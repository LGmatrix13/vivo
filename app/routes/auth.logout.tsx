import { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import Loading from "~/components/common/Loading";
import { auth } from "~/utilties/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Logout" },
    { name: "Vivo: Logout", content: "Logout of Vivo" },
  ];
};

export function action() {
  return auth.loginRedirect();
}

export default function AuthLogout() {
  const fetcher = useFetcher();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetcher.submit(null, { method: "post" });
    }, 650);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <Loading title="Logging out..." />
    </div>
  );
}
