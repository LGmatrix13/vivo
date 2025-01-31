import { json, useLoaderData } from "@remix-run/react";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, Plus, UserSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import DeleteForm from "~/components/forms/DeleteForm";
import ResidentForm from "~/components/forms/ResidentForm";
import { csv } from "~/utilties/csv";
import { IResident } from "~/models/people";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  createResident,
  updateResident,
  deleteResident,
  readResidentsAsRA,
} from "~/repositories/people/residents";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [residents] = await Promise.all([
    readResidentsAsRA(user.id),
    delay(100),
  ]);
  return json({
    residents,
  });
}

export default function RAResidentsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "Firstname",
    lastName: "Lastname",
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
      EditComponent={({ row }) => <ResidentForm resident={row} />}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title={`Delete ${row.fullName}`}
          prompt={`Are you sure you want to delete ${row.fullName}?`}
          toast={`Deleted ${row.fullName}`}
        />
      )}
      ActionButtons={() => (
        <div className="flex space-x-3">
          <IconButton
            Icon={Download}
            className="md:flex hidden"
            onClick={() => {
              csv.download(data.residents, "Residents", rowKeys);
            }}
          >
            Export Residents
          </IconButton>
        </div>
      )}
    />
  );
}
