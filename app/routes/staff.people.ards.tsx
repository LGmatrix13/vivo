import { json, useLoaderData } from "@remix-run/react";
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

  return (
    <Table<IARD>
      columnKeys={columnKeys}
      rows={data.ards}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for an ARD...",
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
        <div className="ml-auto order-2 flex flex-row space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <ARDForm
                residentDropdown={data.raDropdown}
                rdDropdown={data.rdsDropdown}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add ARD</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
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
