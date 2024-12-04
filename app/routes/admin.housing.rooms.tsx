import { defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
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
import AddRoom from "~/components/forms/AddRoom";
import DeleteRoom from "~/components/forms/DeleteRoom";
import EditRoom from "~/components/forms/EditRoom";
import useSearch from "~/hooks/useSearch";
import { delay } from "~/utilties/client/delay";
import { db } from "~/utilties/server/database/connection";
import {
  buildingTable,
  residentTable,
  roomTable,
  zoneTable,
} from "~/utilties/server/database/schema";

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
    .groupBy(roomTable.id, buildingTable.id, residentTable.id)
    .orderBy(buildingTable.name, roomTable.roomNumber);

  const formattedData = data.map((row) => ({
    ...row,
    ra: row.raFirstName ? `${row.raFirstName} ${row.raLastName}` : "",
  }));

  return defer({
    data: formattedData,
  });
}

export default function AdminRoomsPage() {
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
                  placeholder="Search for a Room..."
                  handleSearch={handleSearch}
                />
                <div className="ml-auto order-2 flex space-x-3">
                  <DrawerProvider>
                    <DrawerContent>
                      <AddRoom />
                    </DrawerContent>
                    <DrawerButton>
                      <IconButton Icon={Plus}>Add Room</IconButton>
                    </DrawerButton>
                    <IconButton Icon={Download}>Export</IconButton>{" "}
                  </DrawerProvider>
                </div>
              </div>
              <Table
                columnKeys={{
                  building: "Building",
                  roomNumber: "Room Number",
                  ra: "RA",
                  capacity: "Capacity",
                }}
                rows={filteredData || data}
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
                EditComponent={EditRoom}
                DeleteComponent={DeleteRoom}
              />
            </section>
          );
        }}
      </Await>
    </Suspense>
  );
}
