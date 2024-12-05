import { Await, defer, useLoaderData } from "@remix-run/react";
import { sql, eq } from "drizzle-orm";
import { Suspense } from "react";
import { Download, UserSearch } from "~/components/common/Icons";
import Loading from "~/components/common/Loading";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import useSearch from "~/hooks/useSearch";
import { delay } from "~/utilties/client/delay";
import { db } from "~/utilties/server/database/connection";
import {
  buildingTable,
  roomTable,
  residentTable,
  zoneTable,
  staffTable,
  assistantStaffTable,
} from "~/utilties/server/database/schema";
import { csv } from "~/utilties/client/csv";
import { z } from "zod";
import { build } from "vite";
import ARDForm from "~/components/forms/ARDForm";
import DeleteForm from "~/components/forms/DeleteForm";
import IconButton from "~/components/common/IconButton";
import { useToastContext } from "~/components/common/Toast";

export async function loader() {
  const data = await db
    .select({
      id: assistantStaffTable.id,
      first: residentTable.firstName,
      last: residentTable.lastName,
      fullName:
        sql`concat(${residentTable.firstName}, ' ', ${residentTable.lastName})`.as(
          "fullName"
        ),
      email: residentTable.emailAddress,
      phone: residentTable.phoneNumber,
      mailbox: residentTable.mailbox,
      hometown:
        sql`concat(${residentTable.city}, ', ', ${residentTable.state})`.as(
          "hometown"
        ),
      class: residentTable.class,
      building: buildingTable.name,
      roomBuilding:
        sql`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      rd: sql`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
    })
    .from(assistantStaffTable)
    .leftJoin(
      residentTable,
      eq(assistantStaffTable.residentId, residentTable.id)
    )
    .leftJoin(staffTable, eq(assistantStaffTable.staffId, staffTable.id))
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id));

  return defer({
    data: data,
  });
}

export default function AdminPeopleARDsPage() {
  const initialData = useLoaderData<typeof loader>();
  const toast = useToastContext()

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={delay(initialData.data)}>
        {(data) => {
          const { handleSearch, filteredData } = useSearch(data);
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
                    csv(filteredData || initialData.data, "ARDs");
                    toast.success("ARDs Exported");
                  }}
                >
                  {filteredData?.length ? "Export Subset" : "Export"}
                </IconButton>
              </div>
              </div>
              <Table<any>
                columnKeys={{
                  first: "First",
                  last: "Last",
                  building: "Building",
                  rd: "RD",
                }}
                rows={filteredData || data}
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
        }}
      </Await>
    </Suspense>
  );
}
