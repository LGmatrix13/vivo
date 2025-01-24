import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import { Download, Plus, Upload, UserSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import ARDForm from "~/components/forms/ARDForm";
import DeleteForm from "~/components/forms/DeleteForm";
import IconButton from "~/components/common/IconButton";
import {
  createARD,
  deleteARD,
  readARDs,
  updateARD,
} from "~/repositories/people/ards";
import { IARD } from "~/models/people";
import {
  DrawerProvider,
  DrawerContent,
  DrawerButton,
} from "~/components/common/Drawer";
import { ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { assistantStaffTable, residentTable } from "~/utilties/schema.server";
import { readRDsDropdown } from "~/repositories/people/rds";
import { readResidentsDropdown } from "~/repositories/people/residents";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";

export async function loader() {
  const [ards, rdsDropdown, raDropdown] = await Promise.all([
    readARDs(),
    readRDsDropdown(),
    readResidentsDropdown(
      assistantStaffTable,
      eq(residentTable.id, assistantStaffTable.residentId)
    ),
    delay(100),
  ]);
  return json({
    ards,
    rdsDropdown,
    raDropdown,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createARD(values, request);
    case "update":
      return await updateARD(values, request);
    case "delete":
      return await deleteARD(values, request);
  }
}

export default function StaffAdminPeopleARDsPage() {
  const context = useOutletContext<IBuildingDropdown[]>();
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
    building: "Building",
    rd: "RD",
  };
  const rowKeys = {
    fullName: "Name",
    roomBuilding: "Room Number",
    rd: "RD",
    email: "Email",
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
    <Table<IARD>
      columnKeys={columnKeys}
      rows={data.ards}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for an ARD...",
      }}
      filter={{
        selected: "All",
        key: "buildingId",
        options: buildingOptions,
      }}
      InstructionComponent={() => (
        <Instruction Icon={UserSearch} title="First Select an ARD" />
      )}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title={`Delete ${row.fullName}`}
          prompt={`Are you sure you want to delete ${row.fullName}?`}
          toast={`Deleted ${row.fullName}`}
        />
      )}
      EditComponent={({ row }) => (
        <ARDForm rdDropdown={data.rdsDropdown} ard={row} />
      )}
      ActionButtons={() => (
        <div className="flex space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <ARDForm
                residentDropdown={data.raDropdown}
                rdDropdown={data.rdsDropdown}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus} className="md:w-fit w-full">
                Add ARD
              </IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            className="md:flex hidden"
            onClick={() => {
              csv.download(data.ards, "ARDs", rowKeys);
            }}
          >
            Export ARDs
          </IconButton>
        </div>
      )}
    />
  );
}
