import { useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, UserSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { IResident } from "~/models/people";
import { LoaderFunctionArgs } from "@remix-run/node";
import { readResidentsAsRA } from "~/repositories/people/residents";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { readRoomsDropdown } from "~/repositories/housing/rooms";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [residents, roomsDropdown] = await Promise.all([
    readResidentsAsRA(user.id),
    readRoomsDropdown(),
    delay(100),
  ]);
  return {
    residents,
    roomsDropdown,
  };
}

export default function RAResidentsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "First",
    lastName: "Last",
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

  return (
    <Table<IResident>
      columnKeys={columnKeys}
      rows={data.residents}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for a resident...",
      }}
      InstructionComponent={() => (
        <Instruction Icon={UserSearch} title="First Select a Resident" />
      )}
      ActionButtons={({ rows }) => (
        <div className="flex space-x-3">
          <IconButton
            Icon={Download}
            className="md:flex hidden"
            onClick={() => {
              csv.download(rows, "Residents", rowKeys);
            }}
          >
            Export Residents
          </IconButton>
        </div>
      )}
    />
  );
}
