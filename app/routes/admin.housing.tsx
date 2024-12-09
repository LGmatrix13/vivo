import {
  MetaFunction,
  Outlet,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import Loading from "~/components/common/Loading";
import SubHeader from "~/components/common/SubHeader";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Housing" },
    { name: "Vivo: Housing", content: "Buildings and Rooms" },
  ];
};

export default function AdminHousingLayout() {
  const context = useOutletContext();
  const { state } = useNavigation();

  if (state !== "idle") {
    return <Loading />;
  }

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
      <Outlet context={context} />
    </>
  );
}
