import { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { createRA, deleteRA, uploadMasterCSV } from "~/actions/people";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, Plus, Upload, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import { useToastContext } from "~/components/common/Toast";
import DeleteForm from "~/components/forms/DeleteForm";
import RAForm from "~/components/forms/RAForm";
import UploadMasterCSVForm from "~/components/forms/UploadMasterCSVForm";
import useSearch from "~/hooks/useSearch";
import { IRA } from "~/models/people";
import {
  readRAs,
  readRDsDropdown,
  readResidentsDropdown,
} from "~/repositories/people";
import { csv } from "~/utilties/csv";

export async function loader() {
  const parallelized = await Promise.all([
    readRAs(),
    readResidentsDropdown(),
    readRDsDropdown(),
  ]);

  return json({
    ras: parallelized[0],
    residentsDropdown: parallelized[1],
    rdsDropdown: parallelized[2],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "upload":
      return (await uploadMasterCSV(values)) || redirect(request.url);
    case "create":
      await createRA(values);
      return redirect(request.url);
    case "delete":
      await deleteRA(values);
      return redirect(request.url);
  }

  return redirect(request.url);
}

export default function AdminPeopleRAsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
    building: "Building",
    rd: "RD",
  };
  const { handleSearch, filteredData } = useSearch(
    data.ras,
    Object.keys(columnKeys)
  );
  const toast = useToastContext();

  return (
    <section className="space-y-5">
      <div className="flex">
        <Search placeholder="Search for an RA..." handleSearch={handleSearch} />
        <div className="ml-auto order-2 flex space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <UploadMasterCSVForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Upload}>Upload</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <DownloadButton file="template.csv" Icon={Download}>
            Download Template
          </DownloadButton>
          <DrawerProvider>
            <DrawerContent>
              <RAForm
                residentDropdown={data.residentsDropdown}
                rdDropdown={data.rdsDropdown}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add RA</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(filteredData || data.ras, "RAs");
              toast.success("RAs Exported");
            }}
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IRA>
        columnKeys={columnKeys}
        rows={filteredData || data.ras}
        rowKeys={{
          fullName: "Name",
          roomBuilding: "Room Number",
          rd: "RD",
          email: "Email",
          phone: "Phone Number",
          mailbox: "Mailbox Number",
          hometown: "Hometown",
          class: "Class",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <UserSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Select an RA</h2>
          </div>
        )}
        DeleteComponent={({ row }) => (
          <DeleteForm id={row.id} title={`Delete ${row.fullName}`} />
        )}
        EditComponent={({ row }) => (
          <RAForm ra={row} rdDropdown={data.rdsDropdown} />
        )}
      />
    </section>
  );
}
