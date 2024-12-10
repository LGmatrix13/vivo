import { json, useLoaderData } from "@remix-run/react";
import { eq, sql } from "drizzle-orm";
import {
  DrawerProvider,
  DrawerButton,
  DrawerContent,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, HomeSearch, Plus } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import DeleteForm from "~/components/forms/DeleteForm";
import RoomForm from "~/components/forms/RoomForm";
import useSearch from "~/hooks/useSearch";
import { db } from "~/utilties/connection.server";
import { residentTable, roomTable } from "~/utilties/schema.server";
import { Room } from "~/schemas/room";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs } from "@remix-run/node";
import {
  createRoom,
  deleteRoom,
  readBuildingsDropdown,
  readRooms,
  updateRoom,
} from "~/repositories/housing";
import { IRoom } from "~/models/housing";
import { readRAsDropdown } from "~/repositories/people";

export async function loader() {
  const parallelized = await Promise.all([
    readRooms(),
    readBuildingsDropdown(),
    readRAsDropdown(),
  ]);
  return json({
    rooms: parallelized[0],
    buildingsDropdown: parallelized[1],
    rasDropdown: parallelized[2],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createRoom(values, request);
    case "update":
      return await updateRoom(values, request);
    case "delete":
      return await deleteRoom(values, request);
  }
}

export default function AdminRoomsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    room: "Room",
    capacity: "Capacity",
    raFullName: "RA",
  };
  const { handleSearch, filteredData } = useSearch(
    data.rooms,
    Object.keys(columnKeys)
  );

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
              <RoomForm
                buildingsDropdown={data.buildingsDropdown}
                rasDropdown={data.rasDropdown}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add Room</IconButton>
            </DrawerButton>
            <IconButton
              Icon={Download}
              onClick={() => {
                csv.download(filteredData || data.rooms, "rooms");
              }}
            >
              {filteredData?.length ? "Export Subset" : "Export"}
            </IconButton>
          </DrawerProvider>
        </div>
      </div>
      <Table<IRoom>
        columnKeys={columnKeys}
        rows={filteredData || data.rooms}
        rowKeys={{
          building: "Building",
          roomNumber: "Room #",
          raFullName: "RA",
          capacity: "Capacity",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <HomeSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Open a Room</h2>
          </div>
        )}
        EditComponent={({ row }) => (
          <RoomForm
            room={row}
            buildingsDropdown={data.buildingsDropdown}
            rasDropdown={data.rasDropdown}
          />
        )}
        DeleteComponent={({ row }) => (
          <DeleteForm
            id={row.id}
            title={`Delete ${row.building} ${row.roomNumber}`}
            prompt={`Are you sure you want to delete ${row.building} ${row.roomNumber}?`}
            toast={`Deleted ${row.building} ${row.roomNumber}`}
          />
        )}
      />
    </section>
  );
}
