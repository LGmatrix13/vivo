import { defer, useLoaderData } from "@remix-run/react";
import { sql, eq } from "drizzle-orm";

import { UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import useSearch from "~/hooks/useSearch";
import { db } from "~/utilties/server/database/connection";
import { staffTable, buildingTable } from "~/utilties/server/database/schema";
import { IRD } from "~/models/rd";
import RDForm from "~/components/forms/RDForm";
import DeleteForm from "~/components/forms/DeleteForm";

export async function loader() {
  const data = await db
    .select({
      id: staffTable.id,
      firstName: staffTable.firstName,
      lastName: staffTable.lastName,
      fullName:
        sql`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
          "fullName"
        ),
      email: staffTable.emailAddress,
      mailbox: staffTable.mailbox,
      buildings:
        sql`STRING_AGG(${buildingTable.name}, ', ' ORDER BY ${buildingTable.name})`.as(
          "buildings"
        ),
    })
    .from(staffTable)
    .leftJoin(buildingTable, eq(staffTable.id, buildingTable.staffId))
    .groupBy(staffTable.id)
    .orderBy(staffTable.lastName, staffTable.firstName);

  return defer({
    data: data as IRD[],
  });
}

export default function AdminPeopleRDsPage() {
  const initialData = useLoaderData<typeof loader>();
  const { handleSearch, filteredData } = useSearch(initialData.data);

  return (
    <section className="space-y-5">
      <div className="flex">
        <Search placeholder="Search for an RD..." handleSearch={handleSearch} />
      </div>
      <Table<IRD>
        columnKeys={{
          first: "First",
          last: "Last",
          buildings: "Building",
        }}
        rows={filteredData || initialData.data}
        rowKeys={{
          fullName: "Name",
          buildings: "Building",
          email: "Email",
          mailbox: "Mailbox Number",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <UserSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Select an RD</h2>
          </div>
        )}
        EditComponent={({ row }) => <RDForm rd={row} />}
        DeleteComponent={({ row }) => (
          <DeleteForm id={row.id} title={row.fullName} />
        )}
      />
    </section>
  );
}
