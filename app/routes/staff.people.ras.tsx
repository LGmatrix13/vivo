import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import { eq } from "drizzle-orm";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, Plus, UserSearch } from "~/components/common/Icons";
import Instruction from "~/components/common/Instruction";
import Table from "~/components/common/Table";
import DeleteForm from "~/components/forms/DeleteForm";
import RAForm from "~/components/forms/RAForm";
import { IBuildingDropdown } from "~/models/housing";
import { IRA } from "~/models/people";
import {
  updateRA,
  createRA,
  deleteRA,
  readRAsAsAdmin,
  readRAsAsRD,
} from "~/repositories/people/ras";
import { readRDsDropdown } from "~/repositories/people/rds";
import { readResidentsDropdown } from "~/repositories/people/residents";
import { auth } from "~/utilties/auth.server";
import { csv } from "~/utilties/csv";
import { delay } from "~/utilties/delay.server";
import { residentTable, zoneTable } from "~/utilties/schema.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";

  const [ras, residentsDropdown, rdsDropdown] = await Promise.all([
    admin ? readRAsAsAdmin() : readRAsAsRD(user.id),
    readResidentsDropdown(
      zoneTable,
      eq(residentTable.id, zoneTable.residentId)
    ),
    readRDsDropdown(),
    delay(100),
  ]);

  return json({
    ras,
    residentsDropdown,
    rdsDropdown,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "update":
      return await updateRA(values, request);
    case "create":
      return await createRA(values, request);
    case "delete":
      return await deleteRA(values, request);
  }
}

export default function StaffAdminPeopleRAsPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<IBuildingDropdown[]>();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
    building: "Building",
    alias: "Hall",
  };
  const rowKeys = {
    fullName: "Name",
    roomBuilding: "Room Number",
    alias: "Hall",
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
    <Table<IRA>
      columnKeys={columnKeys}
      rows={data.ras}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for an RA...",
      }}
      filter={{
        selected: "All",
        key: "buildingId",
        options: buildingOptions,
      }}
      InstructionComponent={() => (
        <Instruction Icon={UserSearch} title="First Select an RA" />
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
        <RAForm ra={row} rdsDropdown={data.rdsDropdown} />
      )}
      ActionButtons={() => (
        <div className="ml-auto order-2 flex flex-row space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <RAForm
                residentDropdown={data.residentsDropdown}
                rdsDropdown={data.rdsDropdown}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add RA</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(data.ras, "RAs", rowKeys);
            }}
          >
            Export RAs
          </IconButton>
        </div>
      )}
    />
  );
}
