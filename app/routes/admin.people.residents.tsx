import { Await, defer, useLoaderData } from "@remix-run/react";
import { sql, aliasedTable, eq } from "drizzle-orm";
import { Suspense } from "react";
import { UserSearch } from "~/components/common/Icons";
import Loading from "~/components/common/Loading";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import DeleteForm from "~/components/forms/DeleteForm";
import ResidentForm from "~/components/forms/ResidentForm";
import useSearch from "~/hooks/useSearch";
import { delay } from "~/utilties/client/delay";
import { db } from "~/utilties/server/database/connection";
import {
  buildingTable,
  roomTable,
  residentTable,
  zoneTable,
} from "~/utilties/server/database/schema";

export async function loader() {
  const raInfoTable = aliasedTable(residentTable, "raInfoTable");
  const data = await db
    .select({
      id: residentTable.id,
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
      roomBuilding:
        sql`concat(${buildingTable.name}, ' ', ${roomTable.roomNumber})`.as(
          "roomBuilding"
        ),
      ra: sql`concat(${raInfoTable.firstName}, ' ', ${raInfoTable.lastName})`.as(
        "ra"
      ),
    })
    .from(residentTable)
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(zoneTable, eq(roomTable.zoneId, zoneTable.id))
    .leftJoin(raInfoTable, eq(zoneTable.residentId, raInfoTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .orderBy(residentTable.lastName, residentTable.firstName);

  return defer({
    data: data,
  });
}

export default function AdminPeopleResidentsPage() {
  const initialData = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={delay(initialData.data)}>
        {(data) => {
          const { handleSearch, filteredData } = useSearch(data);
          return (
            <section className="space-y-5">
              <div className="flex">
                <Search
                  placeholder="Search for a resident..."
                  handleSearch={handleSearch}
                />
                <div className="ml-auto order-2 flex space-x-3">
                <IconButton
                Icon={Download}
                onClick={() =>
                  csv(filteredData || initialData.data, "residentsExport")
                }
              >
                Export
              </IconButton>
              </div>
              </div>
              <Table<any>
                columnKeys={{
                  first: "First",
                  last: "Last",
                  roomBuilding: "Room Number",
                }}
                rows={filteredData || data}
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
                    <h2 className="text-xl font-bold">
                      First Select a Resident
                    </h2>
                  </div>
                )}
                EditComponent={({ row }) => <ResidentForm resident={row} />} //TODO
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
