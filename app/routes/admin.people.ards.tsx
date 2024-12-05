import { json, useLoaderData } from "@remix-run/react";
import { Download, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import useSearch from "~/hooks/useSearch";
import { csv } from "~/utilties/client/csv";
import ARDForm from "~/components/forms/ARDForm";
import DeleteForm from "~/components/forms/DeleteForm";
import IconButton from "~/components/common/IconButton";
import { useToastContext } from "~/components/common/Toast";
import { ards } from "~/repositories/people";
import { IARD } from "~/models/people";

export async function loader() {
  return json({
    ards: await ards(),
  });
}

export default function AdminPeopleARDsPage() {
  const data = useLoaderData<typeof loader>();
  const toast = useToastContext();

  const { handleSearch, filteredData } = useSearch(data.ards);
  return (
    <section className="space-y-5">
      <div className="flex">
        <Search
          placeholder="Search for an ARD..."
          handleSearch={handleSearch}
        />
        <div className="ml-auto order-2 flex space-x-3">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv(filteredData || data.ards, "ARDs");
              toast.success("ARDs Exported");
            }}
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IARD>
        columnKeys={{
          firstName: "Firstname",
          lastName: "Lastname",
          building: "Building",
          rd: "RD",
        }}
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
          <DeleteForm id={row.id} title={row.fullName} />
        )}
      />
    </section>
  );
}
