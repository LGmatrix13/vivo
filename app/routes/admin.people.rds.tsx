import { json, useLoaderData } from "@remix-run/react";
import { Download, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import useSearch from "~/hooks/useSearch";
import RDForm from "~/components/forms/RDForm";
import DeleteForm from "~/components/forms/DeleteForm";
import { useToastContext } from "~/components/common/Toast";
import IconButton from "~/components/common/IconButton";
import { csv } from "~/utilties/client/csv";
import { rds } from "~/repositories/people";
import { IRD } from "~/models/people";

export async function loader() {
  return json({
    rds: await rds(),
  });
}

export default function AdminPeopleRDsPage() {
  const initialData = useLoaderData<typeof loader>();
  const { handleSearch, filteredData } = useSearch(initialData.rds);
  const toast = useToastContext();

  return (
    <section className="space-y-5">
      <div className="flex">
        <Search placeholder="Search for an RD..." handleSearch={handleSearch} />
        <div className="ml-auto order-2 flex space-x-3">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv(filteredData || initialData.rds, "RDs");
              toast.success("RDs Exported");
            }}
          >
            {filteredData?.length ? "Export Subset" : "Export"}
          </IconButton>
        </div>
      </div>
      <Table<IRD>
        columnKeys={{
          firstName: "Firstname",
          lastName: "Lastname",
          buildings: "Building",
        }}
        rows={filteredData || initialData.rds}
        rowKeys={{
          fullName: "Name",
          buildings: "Building",
          email: "Email",
          mailbox: "Mailbox Number",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <UserSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Select an RD</h2>
          </div>
        )}
        EditComponent={({ row }) => <RDForm rd={row} />}
        DeleteComponent={({ row }) => (
          <DeleteForm id={row.id} title={row.fullName} />
        )}
      />
    </section>
  );
}
