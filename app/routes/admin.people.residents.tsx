import {
  json,
  redirect,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
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
import ResidentForm from "~/components/forms/ResidentForm";
import UploadForm from "~/components/forms/UploadForm";
import useSearch from "~/hooks/useSearch";
import { csv } from "~/utilties/csv";
import type { AdminPeopleOutletContext } from "./admin.people";
import { readResidents } from "~/repositories/people";
import { IResident } from "~/models/people";
import { db } from "~/utilties/connection.server";
import { residentTable } from "~/utilties/schema.server";
import { eq } from "drizzle-orm";
import { ActionFunctionArgs } from "@remix-run/node";
import { MasterCSV } from "~/schemas/masterCSV";

export async function loader() {
  return json({
    residents: await readResidents(),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "upload":
      const file = values["file"] as File;
      const arrayBuffer = await file.arrayBuffer();
      const content = new TextDecoder("utf-8").decode(arrayBuffer);
      const data = csv.parse<Record<string, any>[]>(content);

      const errors = [];
      const correctRows = [];
      for (const row of data) {
        const result = MasterCSV.safeParse(row);
        if (result.success) {
          correctRows.push(result.data);
        } else {
          errors.push(result.error.message);
        }
      }

      if (errors.length) {
        return json({
          rows: correctRows,
          errors: errors,
        });
      }
      return redirect(request.url);
    case "create":
      return redirect(request.url);
    case "update":
      return redirect(request.url);
    case "delete":
      await db
        .delete(residentTable)
        .where(eq(residentTable.id, Number(values["id"])));
      return redirect(request.url);
  }
}

export default function AdminPeopleResidentsPage() {
  const data = useLoaderData<typeof loader>();
  const toast = useToastContext();
  const context = useOutletContext<AdminPeopleOutletContext>();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
    roomBuilding: "Room Number",
  };
  const { handleSearch, filteredData } = useSearch(
    data.residents,
    Object.keys(columnKeys)
  );
  return (
    <section className="space-y-5">
      <div className="flex">
        <Search
          placeholder="Search for a resident..."
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
              <ResidentForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add Resident</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(filteredData || data.residents, "Residents");
              toast.success("Residents Exported");
            }}
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IResident>
        columnKeys={columnKeys}
        rows={filteredData || data.residents}
        rowKeys={{
          fullName: "Name",
          roomBuilding: "Room Number",
          ra: "RA",
          email: "Email",
          phone: "Phone Number",
          mailbox: "Mailbox Number",
          hometown: "Hometown",
          class: "Class",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <UserSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Select a Resident</h2>
          </div>
        )}
        EditComponent={({ row }) => <ResidentForm resident={row} />} //TODO
        DeleteComponent={({ row }) => (
          <DeleteForm id={row.id} title={`Delete ${row.fullName}`} />
        )}
      />
    </section>
  );
}
