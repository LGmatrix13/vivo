import { json, useLoaderData } from "@remix-run/react";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, Plus, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import DeleteForm from "~/components/forms/DeleteForm";
import ResidentForm from "~/components/forms/ResidentForm";
import useSearch from "~/hooks/useSearch";
import { csv } from "~/utilties/csv";
import { IResident } from "~/models/people";
import { ActionFunctionArgs } from "@remix-run/node";
import {
  readResidents,
  createResident,
  updateResident,
  deleteResident,
} from "~/repositories/people/residents";
import { delay } from "~/utilties/delay.server";

export async function loader() {
  const parallelized = await Promise.all([readResidents(), delay(100)]);
  return json({
    residents: await parallelized[0],
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

export default function AdminPeopleResidentsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "First Name",
    lastName: "Last Name",
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
              <ResidentForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add Resident</IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(
                filteredData || data.residents,
                "Residents",
                rowKeys
              );
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
          emailAddress: "Email",
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
