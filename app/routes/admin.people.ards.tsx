import { json, redirect, useLoaderData } from "@remix-run/react";
import { Download, Plus, Upload, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import useSearch from "~/hooks/useSearch";
import { csv } from "~/utilties/csv";
import ARDForm from "~/components/forms/ARDForm";
import DeleteForm from "~/components/forms/DeleteForm";
import IconButton from "~/components/common/IconButton";
import { useToastContext } from "~/components/common/Toast";
import { readARDs } from "~/repositories/people";
import { IARD } from "~/models/people";
import {
  DrawerProvider,
  DrawerContent,
  DrawerButton,
} from "~/components/common/Drawer";
import { assistantStaffTable } from "~/utilties/schema.server";
import { db } from "~/utilties/connection.server";
import { eq } from "drizzle-orm";
import { ActionFunctionArgs } from "@remix-run/node";
import { createARD, updateARD } from "~/actions/people";
import UploadForm from "~/components/forms/UploadForm";

export async function loader() {
  return json({
    ards: await readARDs(),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      await createARD(values);
      return redirect(request.url);
    case "update":
      await updateARD(values);
      return redirect(request.url);
    case "delete":
      await updateARD(values);
      return redirect(request.url);
  }

  return redirect(request.url);
}

export default function AdminPeopleARDsPage() {
  const data = useLoaderData<typeof loader>();
  const toast = useToastContext();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
    building: "Building",
    rd: "RD",
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
        <div className="ml-auto order-2 flex space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <UploadForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Upload}>Upload</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <DrawerProvider>
            <DrawerContent>
              <ARDForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add ARD</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(filteredData || data.ards, "ARDs");
              toast.success("ARDs Exported");
            }}
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IARD>
        columnKeys={columnKeys}
        rows={filteredData || data.ards}
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
            <h2 className="text-xl font-bold">First Select an ARD</h2>
          </div>
        )}
        EditComponent={({ row }) => <ARDForm ard={row} />}
        DeleteComponent={({ row }) => (
          <DeleteForm id={row.id} title={`Delete ${row.fullName}`} />
        )}
      />
    </section>
  );
}
