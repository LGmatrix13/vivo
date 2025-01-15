import { json, useLoaderData, useOutletContext } from "@remix-run/react";

import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs } from "@remix-run/node";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";

  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
    case "update":
  }
}

export default function StaffReportsEventPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<IBuildingDropdown[]>();
  const columnKeys = {
    time: "Time",
    ra: "RA",
    attendance: "Attendance",
  };
  const rowKeys = {
    ...columnKeys,
    description: "Description",
  };
  const buildingOptions = [
    {
      value: 0,
      key: "All",
    },
    ...context.map((building) => {
      return {
        value: building.id,
        key: building.name,
      };
    }),
  ];

  return (
    <Table
      columnKeys={columnKeys}
      rows={[]}
      search={{
        placeholder: "Search for an event...",
      }}
      filter={{
        key: "buildingId",
        options: buildingOptions,
        selected: "All",
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select an Event" />
      )}
    />
  );
}
