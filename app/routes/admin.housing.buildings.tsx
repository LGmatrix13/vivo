import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { count, eq, sum } from "drizzle-orm";
import { useState } from "react";
import IconButton from "~/components/IconButton";
import { Download, HomeSearch, Plus } from "~/components/Icons";
import Loading from "~/components/Loading";
import Search from "~/components/Search";
import Table from "~/components/Table";
import useLoading from "~/hooks/useLoading";
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
  const { loading } = useLoading();
  const [data, setData] = useState(initialData);

  function handleSearch(term: string) {
    const lowerCaseTerm = term.toLowerCase();
    setData(() =>
      initialData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowerCaseTerm)
        )
      )
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="space-y-5">
      <div className="flex">
        <Search
          placeholder="Search for a building..."
          handleSearch={handleSearch}
        />
        <div className="ml-auto order-2 flex space-x-3">
          <IconButton Icon={Plus}>Add Building</IconButton>
          <IconButton Icon={Download}>Export</IconButton>{" "}
        </div>
      </div>
      <Table
        columnKeys={{
          name: "Name",
          rd: "rd",
          zones: "Zones",
          capacity: "Capacity",
        }}
        rows={data}
        rowKeys={{
          name: "Name",
          rd: "RD",
          zones: "Zones",
          capacity: "Capacity",
          rooms: "Rooms",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <HomeSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Open a Building</h2>
          </div>
        )}
      />
    </section>
  );
}
