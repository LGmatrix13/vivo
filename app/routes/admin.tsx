import { Outlet } from "@remix-run/react";
import AdminHeader from "~/components/AdminHeader";
import "@fontsource-variable/golos-text";

export default function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <main className="max-w-screen-xl mx-auto pl-5 pr-5 nb-7">
        <Outlet />
      </main>
    </>
  );
}
