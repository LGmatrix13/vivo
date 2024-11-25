import { MetaFunction, Outlet } from "@remix-run/react";
import SubHeader from "~/components/SubHeader";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Housing" },
    { name: "Vivo: Housing", content: "Buildings and Rooms" },
  ];
};

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
