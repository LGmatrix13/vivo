import { json, useLoaderData } from "@remix-run/react";
import { Download, Plus, Upload, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import useSearch from "~/hooks/useSearch";
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

import UploadMasterCSVForm from "~/components/forms/UploadMasterCSVForm";
import DownloadButton from "~/components/common/DownloadButton";
import { eq } from "drizzle-orm";
import { assistantStaffTable, residentTable } from "~/utilties/schema.server";
import { readRDsDropdown } from "~/repositories/people/rds";
import { uploadMasterCSV } from "~/repositories/people/ras";
import { readResidentsDropdown } from "~/repositories/people/residents";
import { delay } from "~/utilties/delay.server";

export async function loader() {
  const parallelized = await Promise.all([
    readARDs(),
    readRDsDropdown(),
    readResidentsDropdown(
      assistantStaffTable,
      eq(residentTable.id, assistantStaffTable.residentId)
    ),
    delay(100),
  ]);
  return json({
    ards: parallelized[0],
    rdsDropdown: parallelized[1],
    raDropdown: parallelized[2],
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

export default function AdminPeopleARDsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "First Name",
    lastName: "Last Name",
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
  const { handleSearch, filteredData } = useSearch(
    data.ards,
    Object.keys(columnKeys)
  );
  return (
    <section className="space-y-5">
      <div className="flex">
        <Search
          placeholder="Search for an ARD..."
          handleSearch={handleSearch}
        />
        <div className="ml-auto order-2 flex flex-row space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <ARDForm
                residentDropdown={data.raDropdown}
                rdDropdown={data.rdsDropdown}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus} secondary>
                Add ARD
              </IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(filteredData || data.ards, "ARDs", rowKeys);
            }}
            secondary
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IARD>
        columnKeys={columnKeys}
        rows={filteredData || data.ards}
        rowKeys={rowKeys}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <UserSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Select an ARD</h2>
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
          <ARDForm rdDropdown={data.rdsDropdown} ard={row} />
        )}
      />
    </section>
  );
}
