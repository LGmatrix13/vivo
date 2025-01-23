import { json, useLoaderData, useOutletContext } from "@remix-run/react";

import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { ActionFunctionArgs } from "@remix-run/node";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";
import { readRAsAsAdmin, readRAsAsRD } from "~/repositories/people/ras";
import {
  createEvent,
  readEventReportsAdmin,
  readEventReportsRD,
  updateEvent,
} from "~/repositories/reports/event";
import { delay } from "~/utilties/delay.server";
import { IEventReport } from "~/models/reports";
import IconButton from "~/components/common/IconButton";
import { csv } from "~/utilties/csv";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [events, ras] = await Promise.all([
    admin ? readEventReportsAdmin() : readEventReportsRD(user.id),
    admin ? readRAsAsAdmin() : readRAsAsRD(user.id),
    delay(100),
  ]);

  return json({
    events,
    ras,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createEvent(values, request);
    case "update":
      return await updateEvent(values, request);
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
    <Table<IEventReport>
      columnKeys={columnKeys}
      rows={data.events}
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
      ActionButtons={({ rows }) => (
        <IconButton
          Icon={Download}
          className="md:w-fit w-full"
          onClick={() => {
            csv.download(rows, "Events", rowKeys);
          }}
        >
          Export Event Reports
        </IconButton>
      )}
    />
  );
}
