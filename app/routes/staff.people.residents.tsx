import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, Plus, UserSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import DeleteForm from "~/components/forms/DeleteForm";
import ResidentForm from "~/components/forms/ResidentForm";
import { csv } from "~/utilties/csv";
import { IResident } from "~/models/people";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  createResident,
  updateResident,
  deleteResident,
  readResidentsAsAdmin,
  readResidentsAsRD,
} from "~/repositories/people/residents";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown, IRoomDropdown } from "~/models/housing";
import { readRoomsDropdown } from "~/repositories/housing/rooms";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [residents, roomsDropdown] = await Promise.all([
    admin ? readResidentsAsAdmin() : readResidentsAsRD(user.id),
    readRoomsDropdown(),
    delay(100),
  ]);
  return json({
    residents,
    roomsDropdown,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createResident(values, request);
    case "update":
      return await updateResident(values, request);
    case "delete":
      return await deleteResident(values, request);
  }
}

export default function StaffAdminPeopleResidentsPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<IBuildingDropdown[]>();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
    roomBuilding: "Room",
  };
  const rowKeys = {
    fullName: "Name",
    roomBuilding: "Room Number",
    ra: "RA",
    emailAddress: "Email",
    phone: "Phone Number",
    mailbox: "Mailbox Number",
    hometown: "Hometown",
    class: "Class",
  };
  const buildingOptions = [
    {
      value: 0,
      key: "All",
    },
    ...context.map((building) => {
      return {
        value: building.id,
        key: building.name,
      };
    }),
  ];

  return (
    <Table<IResident>
      columnKeys={columnKeys}
      rows={data.residents}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for a resident...",
      }}
      filter={{
        selected: "All",
        key: "buildingId",
        options: buildingOptions,
      }}
      InstructionComponent={() => (
        <Instruction Icon={UserSearch} title="First Select a Resident" />
      )}
      EditComponent={({ row }) => (
        <ResidentForm 
          resident={row}
          roomsDropdown={data.roomsDropdown}
        />
      )}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title={`Delete ${row.fullName}`}
          prompt={`Are you sure you want to delete ${row.fullName}?`}
          toast={`Deleted ${row.fullName}`}
        />
      )}
      ActionButtons={({rows}) => (
        <div className="flex space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <ResidentForm roomsDropdown={data.roomsDropdown}/>
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus} className="md:w-fit w-full">
                Resident
              </IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            className="md:flex hidden"
            onClick={() => {
              csv.download(rows, "Residents", rowKeys);
            }}
          >
            Export Residents
          </IconButton>
        </div>
      )}
    />
  );
}
