import { json, useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import { useToastContext } from "~/components/common/Toast";
import DeleteForm from "~/components/forms/DeleteForm";
import RAForm from "~/components/forms/RAForm";
import useSearch from "~/hooks/useSearch";
import { IRA } from "~/models/people";
import { readRAs } from "~/repositories/people";
import { csv } from "~/utilties/client/csv";

export async function loader() {
  return json({
    data: await readRAs(),
  });
}

export default function AdminPeopleRAsPage() {
  const initialData = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
    building: "Building",
    rd: "RD",
  };
  const { handleSearch, filteredData } = useSearch(
    initialData.data,
    Object.keys(columnKeys)
  );
  const toast = useToastContext();

  return (
    <section className="space-y-5">
      <div className="flex">
        <Search placeholder="Search for an RA..." handleSearch={handleSearch} />
        <div className="ml-auto order-2 flex space-x-3">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv(filteredData || initialData.data, "RAs");
              toast.success("RAs Exported");
            }}
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IRA>
        columnKeys={columnKeys}
        rows={filteredData || initialData.data}
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
        EditComponent={({ row }) => <RAForm ra={row} />} //TODO
        DeleteComponent={({ row }) => (
          <DeleteForm id={row.id} title={row.fullName} />
        )}
      />
    </section>
  );
}
