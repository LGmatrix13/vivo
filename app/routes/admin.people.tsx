import {
  json,
  MetaFunction,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { eq, sql } from "drizzle-orm";
import SubHeader from "~/components/common/SubHeader";
import { db } from "~/utilties/server/database/connection";
import {
  buildingTable,
  residentTable,
  staffTable,
  zoneTable,
} from "~/utilties/server/database/schema";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: People" },
    { name: "Vivo: People", content: "Residents, RAs, ARDS, and RDs" },
  ];
};

export interface AdminPeopleOutletContext {
  buildings: {
    id: number;
    name: string;
  }[];
  ras: {
    id: number;
    name: string;
  }[];
  rds: {
    id: number;
    name: string;
  }[];
}

export async function loader() {
  const buildings = await db
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
    })
    .from(buildingTable);

  const ras = await db
    .select({
      id: zoneTable.id,
      ra: sql<string>`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`,
    })
    .from(residentTable)
    .innerJoin(zoneTable, eq(residentTable.id, zoneTable.residentId));

  const rds = await db
    .select({
      id: staffTable.id,
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`,
    })
    .from(staffTable);

  return json({
    buildings,
    ras,
    rds,
  });
}
export default function AdminPeopleLayout() {
  const data = useLoaderData<typeof loader>();
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
            name: "ARDs",
            path: "/admin/people/ards",
          },
          {
            name: "RDs",
            path: "/admin/people/rds",
          },
        ]}
      />
      <Outlet
        context={{
          buildings: data.buildings,
          ras: data.ras,
          rds: data.rds,
        }}
      />
    </>
  );
}
