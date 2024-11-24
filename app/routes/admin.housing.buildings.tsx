import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { count, eq, sql, sum } from "drizzle-orm";
import { useState } from "react";
import Search from "~/components/Search";
import SelectedBuilding from "~/components/SelectedBuilding";
import Table from "~/components/Table";
import { db } from "~/utilties/database/connection";
import {
  buildingTable,
  roomTable,
  staffTable,
  zoneTable,
} from "~/utilties/database/schema";

export async function loader() {
  const data = await db
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
      rdFirstName: staffTable.firstName,
      rdLastName: staffTable.lastName,
      lastName: staffTable.lastName,
      rooms: count(roomTable.id),
      zones: count(zoneTable.id),
      capacity: sum(roomTable.capacity),
    })
    .from(buildingTable)
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .leftJoin(zoneTable, eq(staffTable.id, zoneTable.staffId))
    .leftJoin(roomTable, eq(zoneTable.id, roomTable.zoneId))
    .groupBy(buildingTable.id, staffTable.id);

  const formattedData = data.map((row) => ({
    ...row,
    rd: `${row.rdFirstName} ${row.rdLastName}`,
  }));

  return json(formattedData);
}

export default function AdminBuldingsPage() {
  const initialData = useLoaderData<typeof loader>();
  const [data, setData] = useState(initialData);

  function handleSearch(term: string) {
    const lowerCaseTerm = term.toLowerCase();
    console.log("ran");
    setData(() =>
      initialData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowerCaseTerm)
        )
      )
    );
  }

  return (
    <section className="space-y-5">
      <Search
        placeholder="Search for a building..."
        handleSearch={handleSearch}
      />
      <Table
        columns={["name", "rd", "zones", "capacity"]}
        rows={data}
        SelectedComponent={SelectedBuilding}
      />
    </section>
  );
}
