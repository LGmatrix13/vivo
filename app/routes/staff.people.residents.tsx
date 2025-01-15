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
  readResidents,
} from "~/repositories/people/residents";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";

export async function loader({ request }: LoaderFunctionArgs) {
  const [residents] = await Promise.all([readResidents(), delay(100)]);
  return json({
    residents,
  });
}

export async function action({ request }: ActionFunctionArgs) {
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
      EditComponent={({ row }) => <ResidentForm resident={row} />}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title={`Delete ${row.fullName}`}
          prompt={`Are you sure you want to delete ${row.fullName}?`}
          toast={`Deleted ${row.fullName}`}
        />
      )}
      ActionButtons={() => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <DrawerProvider>
            <DrawerContent>
              <ResidentForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add Resident</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(data.residents, "Residents", rowKeys);
            }}
          >
            Export Residents
          </IconButton>
        </div>
      )}
    />
  );
}
