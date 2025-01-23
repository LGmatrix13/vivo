import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { ActionFunctionArgs } from "@remix-run/node";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import {
  createEvent,
  readEventReportsRA,
  updateEvent,
} from "~/repositories/reports/event";
import { delay } from "~/utilties/delay.server";
import { IEventReport } from "~/models/reports";
import IconButton from "~/components/common/IconButton";
import { csv } from "~/utilties/csv";
import { createReadReport } from "~/repositories/ReadReports/readReports";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [events] = await Promise.all([readEventReportsRA(user.id), delay(100)]);

  return json({
    events,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["ra"]);
  const user = await auth.readUser(request, ["ra"]);
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createEvent(values, request);
    case "update":
      return await updateEvent(values, request);
    case "create.read":
      return await createReadReport(
        {
          ...values,
          personId: user.id,
          reportType: "EVENT",
          personType: "ZONE",
        },
        request
      );
  }
}

export default function RAReportsEventPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const columnKeys = {
    time: "Time",
    ra: "RA",
    attendance: "Attendance",
  };
  const rowKeys = {
    ...columnKeys,
    description: "Description",
  };

  return (
    <Table<IEventReport>
      columnKeys={columnKeys}
      rows={data.events as IEventReport[]}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for an event report...",
      }}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select an Event Report" />
      )}
      ActionButtons={({ rows }) => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(rows, "Events", rowKeys);
            }}
          >
            Export Event Reports
          </IconButton>
        </div>
      )}
      onRowRead={({ row }) => {
        fetcher.submit(
          {
            intent: "create.read",
            reportId: row.id,
          },
          {
            method: "POST",
          }
        );
      }}
    />
  );
}
