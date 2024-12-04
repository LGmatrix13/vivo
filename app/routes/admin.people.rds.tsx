import { ActionFunctionArgs } from "@remix-run/node";
import { Await, defer, redirect, useLoaderData } from "@remix-run/react";
import { sql, count, eq } from "drizzle-orm";
import { Suspense } from "react";
import {
  DrawerProvider,
  DrawerButton,
  DrawerContent,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, HomeSearch, Plus } from "~/components/common/Icons";
import Loading from "~/components/common/Loading";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import AddBuilding from "~/components/forms/AddBuilding";
import DeleteBuilding from "~/components/forms/DeleteBuilding";
import EditBuilding from "~/components/forms/EditBuilding";
import useSearch from "~/hooks/useSearch";
import { delay } from "~/utilties/client/delay";
import { db } from "~/utilties/server/database/connection";
import {
  staffTable,
  buildingTable
} from "~/utilties/server/database/schema";
import { csv } from "~/utilties/client/csv";
import { z } from "zod";
import { build } from "vite";

export async function loader() {
  const data = await db
    .select({
      id: staffTable.id,
      first: staffTable.firstName,
      last: staffTable.lastName,
      fullName: sql`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as("fullName"),
      email: staffTable.emailAddress,
      mailbox: staffTable.mailbox,
      buildings: sql`STRING_AGG(${buildingTable.name}, ', ' ORDER BY ${buildingTable.name})`.as("buildings")
    })
    .from(staffTable)
    .leftJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .groupBy(staffTable.id)
    .orderBy(staffTable.lastName, staffTable.firstName);

  return defer({
    data: data,
  });
}

export default function AdminPeopleRDsPage() {
  const initialData = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={delay(initialData.data)}>
        {(data) => {
          const { handleSearch, filteredData } = useSearch(data);
          return (
            <section className="space-y-5">
              <div className="flex">
                <Search
                  placeholder="Search for an RD..."
                  handleSearch={handleSearch}
                />
              </div>
              <Table
                columnKeys={{
                  first: "First",
                  last: "Last",
                  buildings: "Building",
                }}
                rows={filteredData}
                rowKeys={{
                  fullName: "Name",
                  buildings: "Building",
                  email: "Email",
                  mailbox: "Mailbox Number"
                }}
                InstructionComponent={() => (
                  <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
                    <HomeSearch className="w-7 h-7" />
                    <h2 className="text-xl font-bold">First Select an RD</h2>
                  </div>
                )}
                EditComponent={EditBuilding} //TODO
                DeleteComponent={DeleteBuilding} //TODO
              />
            </section>
          );
        }}
      </Await>
    </Suspense>
  );
}
