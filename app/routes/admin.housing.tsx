import { Outlet } from "@remix-run/react";
import SubHeader from "~/components/SubHeader";

export default function AdminHousingLayout() {
  return (
    <>
      <SubHeader
        pages={[
          {
            name: "Buildings",
            path: "/admin/housing/buildings",
          },
          {
            name: "Rooms",
            path: "/admin/housing/rooms",
          },
        ]}
      />
      <Outlet />
    </>
  );
}
