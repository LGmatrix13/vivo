import { defer, useLoaderData } from "@remix-run/react";
import { sql, eq } from "drizzle-orm";
import IconButton from "~/components/common/IconButton";
import { Download, UserSearch } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import { useToastContext } from "~/components/common/Toast";
import DeleteForm from "~/components/forms/DeleteForm";
import RAForm from "~/components/forms/RAForm";
import useSearch from "~/hooks/useSearch";
import { IRA } from "~/models/ra";
import { csv } from "~/utilties/client/csv";
import { db } from "~/utilties/server/database/connection";
import {
  buildingTable,
  roomTable,
  residentTable,
  zoneTable,
  staffTable,
} from "~/utilties/server/database/schema";

export async function loader() {
  const data = await db
    .select({
      id: zoneTable.id,
      firstName: residentTable.firstName,
      lastName: residentTable.lastName,
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
    .from(zoneTable)
    .innerJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
    .leftJoin(roomTable, eq(residentTable.roomId, roomTable.id))
    .leftJoin(buildingTable, eq(roomTable.buildingId, buildingTable.id))
    .leftJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .orderBy(
      buildingTable.name,
      residentTable.lastName,
      residentTable.firstName
    );

  return defer({
    data: data as IRA[],
  });
}

export default function AdminPeopleRAsPage() {
  const initialData = useLoaderData<typeof loader>();
  const { handleSearch, filteredData } = useSearch(initialData.data);
  const toast = useToastContext()

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
        columnKeys={{
          firstName: "Firstname",
          lastName: "Lastname",
          building: "Building",
          rd: "RD",
        }}
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
