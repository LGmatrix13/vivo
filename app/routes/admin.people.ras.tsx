import { ActionFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import DownloadButton from "~/components/common/DownloadButton";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, Plus, Upload, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import DeleteForm from "~/components/forms/DeleteForm";
import RAForm from "~/components/forms/RAForm";
import UploadMasterCSVForm from "~/components/forms/UploadMasterCSVForm";
import useSearch from "~/hooks/useSearch";
import { IRA } from "~/models/people";
import {
  readRAs,
  uploadMasterCSV,
  updateRA,
  createRA,
  deleteRA,
} from "~/repositories/people/ras";
import { readRDsDropdown } from "~/repositories/people/rds";
import { readResidentsDropdown } from "~/repositories/people/residents";
import { csv } from "~/utilties/csv";
import { delay } from "~/utilties/delay.server";
import { residentTable, zoneTable } from "~/utilties/schema.server";

export async function loader() {
  const parallelized = await Promise.all([
    readRAs(),
    readResidentsDropdown(
      zoneTable,
      eq(residentTable.id, zoneTable.residentId)
    ),
    readRDsDropdown(),
    delay(100),
  ]);

  return json({
    ras: parallelized[0],
    residentsDropdown: parallelized[1],
    readRDsDropdown: parallelized[2],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "upload":
      return await uploadMasterCSV(values, request);
    case "update":
      return await updateRA(values, request);
    case "create":
      return await createRA(values, request);
    case "delete":
      return await deleteRA(values, request);
  }
}

export default function AdminPeopleRAsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "First Name",
    lastName: "Last Name",
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
  const { handleSearch, filteredData } = useSearch(
    data.ras,
    Object.keys(columnKeys)
  );

  return (
    <section className="space-y-5">
      <div className="flex">
        <Search placeholder="Search for an RA..." handleSearch={handleSearch} />
        <div className="ml-auto order-2 flex space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <RAForm
                residentDropdown={data.residentsDropdown}
                rdsDropdown={data.readRDsDropdown}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add RA</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(filteredData || data.ras, "RAs", rowKeys);
            }}
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IRA>
        columnKeys={columnKeys}
        rows={filteredData || data.ras}
        rowKeys={rowKeys}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <UserSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Select an RA</h2>
          </div>
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
          <RAForm ra={row} rdsDropdown={data.readRDsDropdown} />
        )}
      />
    </section>
  );
}
