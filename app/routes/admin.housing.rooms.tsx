import { defer } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import {
  DrawerProvider,
  DrawerButton,
  DrawerContent,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, HomeSearch, Plus } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import { useToastContext } from "~/components/common/Toast";
import DeleteForm from "~/components/forms/DeleteForm";
import RoomForm from "~/components/forms/RoomForm";
import useSearch from "~/hooks/useSearch";
import { db } from "~/utilties/server/database/connection";
import { roomTable } from "~/utilties/server/database/schema";
import { Room } from "~/schemas/room";
import { csv } from "~/utilties/client/csv";
import { redirect } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { readRooms } from "~/repositories/housing";
import { IRoom } from "~/models/housing";

export async function loader() {
  return json({
    rooms: await readRooms(),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  if (intent === "create") {
    const room = Room.safeParse(values);

    if (room.success) {
      await db.insert(roomTable).values(room.data);
    }
  } else if (intent === "delete") {
    await db.delete(roomTable).where(eq(roomTable.id, Number(values["id"])));
  }

  return redirect(request.url);
}

export default function AdminRoomsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    building: "Building",
    roomNumber: "Room #",
    capacity: "Capacity",
    raFullName: "RA",
  };
  const { handleSearch, filteredData } = useSearch(
    data.rooms,
    Object.keys(columnKeys)
  );
  const toast = useToastContext();

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
              <RoomForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add Room</IconButton>
            </DrawerButton>
            <IconButton
              Icon={Download}
              onClick={() => {
                csv(filteredData || data.rooms, "rooms");
                toast.success("Rooms Exported");
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
        EditComponent={({ row }) => <RoomForm room={row} />}
        DeleteComponent={({ row }) => (
          <DeleteForm
            id={row.id}
            title={`${row.building} ${row.roomNumber}`}
            toast="Deleted Room"
          />
        )}
      />
    </section>
  );
}
