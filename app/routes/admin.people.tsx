import { MetaFunction, Outlet, useOutletContext } from "@remix-run/react";
import SubHeader from "~/components/common/SubHeader";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: People" },
    { name: "Vivo: People", content: "Residents, RAs, and RDs" },
  ];
};

export default function AdminPeopleLayout() {
  const context = useOutletContext();
  return (
    <>
      <SubHeader
        pages={[
          {
            name: "Residents",
            path: "/admin/people/residents",
          },
          {
            name: "RAs",
            path: "/admin/people/ras",
          },
          {
            name: "RDs",
            path: "/admin/people/rds",
          },
        ]}
      />
      <Outlet context={context} />
    </>
  );
}
