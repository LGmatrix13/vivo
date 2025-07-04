import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import {
  DrawerProvider,
  DrawerButton,
  DrawerContent,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, HomeSearch, Plus } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import DeleteForm from "~/components/forms/DeleteForm";
import RoomForm from "~/components/forms/RoomForm";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { IBuildingDropdown, IRoom } from "~/models/housing";
import {
  createRoom,
  deleteRoom,
  readRoomsAsAdmin,
  readRoomsAsRD,
  updateRoom,
} from "~/repositories/housing/rooms";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import {
  readRAsDropdownAsAdmin,
  readRAsDropdownAsRD,
} from "~/repositories/people/ras";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [rooms, rasDropdown] = await Promise.all([
    admin ? readRoomsAsAdmin() : readRoomsAsRD(user.id),
    admin ? readRAsDropdownAsAdmin() : readRAsDropdownAsRD(user.id),
    delay(100),
  ]);
  return json({
    rooms,
    rasDropdown,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

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

export default function StaffHousingRoomsPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<{
    buildingsDropdown: IBuildingDropdown[];
  }>();
  const columnKeys = {
    room: "Room",
    capacity: "Capacity",
    zone: "Zone",
    raFullName: "RA",
  };
  const rowKeys = {
    building: "Building",
    roomNumber: "Room #",
    zone: "Zone",
    raFullName: "RA",
    capacity: "Capacity",
  };
  const buildingOptions = [
    {
      value: 0,
      key: "All",
    },
    ...context.buildingsDropdown.map((building) => {
      return {
        value: building.id,
        key: building.name,
      };
    }),
  ];
  return (
    <Table<IRoom>
      columnKeys={columnKeys}
      rows={data.rooms}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for a room...",
      }}
      filter={{
        key: "buildingId",
        selected: "All",
        options: buildingOptions,
      }}
      InstructionComponent={() => (
        <Instruction Icon={HomeSearch} title="First Select a Room" />
      )}
      EditComponent={({ row }) => (
        <RoomForm
          room={row}
          buildingsDropdown={context.buildingsDropdown}
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
      ActionButtons={({rows}) => (
        <div className="flex flex-row space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <RoomForm
                buildingsDropdown={context.buildingsDropdown}
                rasDropdown={data.rasDropdown}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus} className="md:w-fit w-full">
                Add Room
              </IconButton>
            </DrawerButton>
            <IconButton
              className="md:flex hidden"
              Icon={Download}
              onClick={() => {
                csv.download(rows, "rooms", rowKeys);
              }}
            >
              Export Rooms
            </IconButton>
          </DrawerProvider>
        </div>
      )}
    />
  );
}
