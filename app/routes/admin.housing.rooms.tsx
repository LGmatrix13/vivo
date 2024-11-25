import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
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
  residentTable,
  roomTable,
  zoneTable,
} from "~/utilties/database/schema";

export async function loader() {
  const data = await db
    .select({
      id: roomTable.id,
      building: buildingTable.name,
      raFirstName: residentTable.firstName,
      raLastName: residentTable.lastName,
      roomNumber: roomTable.roomNumber,
      capacity: roomTable.capacity,
    })
    .from(roomTable)
    .innerJoin(buildingTable, eq(buildingTable.id, roomTable.buildingId))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(residentTable, eq(residentTable.id, zoneTable.residentId))
    .groupBy(roomTable.id, buildingTable.id, residentTable.id);

  const formattedData = data.map((row) => ({
    ...row,
    ra: row.raFirstName ? `${row.raFirstName} ${row.raLastName}` : "",
  }));

  return json(formattedData);
}

export default function AdminRoomsPage() {
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
          placeholder="Search for a Room..."
          handleSearch={handleSearch}
        />
        <div className="ml-auto order-2 flex space-x-3">
          <IconButton Icon={Plus}>Add Room</IconButton>
          <IconButton Icon={Download}>Export</IconButton>{" "}
        </div>
      </div>
      <Table
        columnKeys={{
          building: "Building",
          roomNumber: "Room Number",
          ra: "RA",
          capacity: "Capacity",
        }}
        rows={data}
        rowKeys={{
          building: "Building",
          roomNumber: "Room Number",
          ra: "RA",
          capacity: "Capacity",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <HomeSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Open a Room</h2>
          </div>
        )}
      />
    </section>
  );
}
