import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import AdminHeader from "~/components/common/AdminHeader";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await auth.cookie.parse(cookieHeader);
  if (!cookie) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await auth.cookie.serialize(""),
      },
    });
  }
  const decodedJwt = await auth.decodeJWT(cookie, "admin");
  if (!decodedJwt) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await auth.cookie.serialize(""),
      },
    });
  }
  return decodedJwt;
}

export default function AdminLayout() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <AdminHeader />
      <main className="max-w-screen-2xl mx-auto px-10 mb-7">
        <Outlet context={data} />
      </main>
    </>
  );
}
