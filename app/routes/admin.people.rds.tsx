import { json, useLoaderData } from "@remix-run/react";
import { Download, Plus, Upload, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import useSearch from "~/hooks/useSearch";
import RDForm from "~/components/forms/RDForm";
import DeleteForm from "~/components/forms/DeleteForm";
import IconButton from "~/components/common/IconButton";
import { csv } from "~/utilties/csv";
import {
  createRD,
  deleteRD,
  readRDs,
  updateRD,
  uploadMasterCSV,
} from "~/repositories/people";
import { IRD } from "~/models/people";
import {
  DrawerProvider,
  DrawerContent,
  DrawerButton,
} from "~/components/common/Drawer";
import { readBuildingsDropdown } from "~/repositories/housing";
import { ActionFunctionArgs } from "@remix-run/node";
import UploadMasterCSVForm from "~/components/forms/UploadMasterCSVForm";
import DownloadButton from "~/components/common/DownloadButton";

export async function loader() {
  const parallelized = await Promise.all([readRDs(), readBuildingsDropdown()]);
  return json({
    rds: parallelized[0],
    buildingsDropdown: parallelized[1],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "upload":
      return await uploadMasterCSV(values, request);
    case "create":
      return await createRD(values, request);
    case "update":
      return await updateRD(values, request);
    case "delete":
      return await deleteRD(values, request);
  }
}

export default function AdminPeopleRDsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
    buildings: "Building",
  };
  const { handleSearch, filteredData } = useSearch(
    data.rds,
    Object.keys(columnKeys)
  );

  return (
    <section className="space-y-5">
      <div className="flex">
        <Search placeholder="Search for an RD..." handleSearch={handleSearch} />
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
              <RDForm buildingsDropdown={data.buildingsDropdown} />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add RD</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(filteredData || data.rds, "RDs");
            }}
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IRD>
        columnKeys={columnKeys}
        rows={filteredData || data.rds}
        rowKeys={{
          fullName: "Name",
          buildings: "Building",
          emailAddress: "Email Address",
          mailbox: "Mailbox Number",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <UserSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Select an RD</h2>
          </div>
        )}
        EditComponent={({ row }) => (
          <RDForm rd={row} buildingsDropdown={data.buildingsDropdown} />
        )}
        DeleteComponent={({ row }) => (
          <DeleteForm
            id={row.id}
            title={`Delete ${row.fullName}`}
            prompt={`Are you sure you want to delete ${row.fullName}?`}
            toast={`Deleted ${row.fullName}`}
          />
        )}
      />
    </section>
  );
}
