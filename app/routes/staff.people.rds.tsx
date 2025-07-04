import { json, useLoaderData } from "@remix-run/react";
import { Download, Plus, UserSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import RDForm from "~/components/forms/RDForm";
import DeleteForm from "~/components/forms/DeleteForm";
import IconButton from "~/components/common/IconButton";
import { csv } from "~/utilties/csv";
import { IRD } from "~/models/people";
import {
  DrawerProvider,
  DrawerContent,
  DrawerButton,
} from "~/components/common/Drawer";
import { ActionFunctionArgs } from "@remix-run/node";
import {
  readRDs,
  createRD,
  updateRD,
  deleteRD,
} from "~/repositories/people/rds";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";

export async function loader({ request }: ActionFunctionArgs) {
  const [rds] = await Promise.all([readRDs(), delay(100)]);
  return json({
    rds,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createRD(values, request);
    case "update":
      return await updateRD(values, request);
    case "delete":
      return await deleteRD(values, request);
  }
}

export default function StaffAdminPeopleRDsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    firstName: "First",
    lastName: "Last",
    buildings: "Building",
  };
  const rowKeys = {
    ...columnKeys,
    emailAddress: "Email Address",
    mailbox: "Mailbox Number",
  };

  return (
    <Table<IRD>
      rows={data.rds}
      columnKeys={columnKeys}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={UserSearch} title="First Select an RD" />
      )}
      search={{
        placeholder: "Search for an RD...",
      }}
      EditComponent={({ row }) => <RDForm rd={row} />}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title={`Delete ${row.fullName}`}
          prompt={`Are you sure you want to delete ${row.fullName}?`}
          toast={`Deleted ${row.fullName}`}
        />
      )}
      ActionButtons={({rows}) => (
        <div className="flex flex-row space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <RDForm />
            </DrawerContent>
            <DrawerButton>
              <IconButton className="md:w-fit w-full" Icon={Plus}>
                Add RD
              </IconButton>
            </DrawerButton>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            className="md:flex hidden"
            onClick={() => {
              csv.download(rows, "RDs", rowKeys);
            }}
          >
            Export RDs
          </IconButton>
        </div>
      )}
    />
  );
}
