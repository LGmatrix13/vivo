import { json, useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";

import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";
import {
  updateConversation,
  createConversation,
  readConversationReportsAsRA,
} from "~/repositories/reports/conversations";
import { createReadReport } from "~/repositories/ReadReports/readReports";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [conversation] = await Promise.all([
    readConversationReportsAsRA(user.id),
    delay(100),
  ]);
  return json({
    conversation,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["ra"]);
  const user = await auth.readUser(request, ["ra"]);
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createConversation(values, request);
    case "update":
      return await updateConversation(values, request);
    case "create.read":
      return await createReadReport(
        {
          ...values,
          personId: user.id,
          reportType: "CONVERSATION",
          personType: "ZONE",
        },
        request
      );
  }
}

export default function RAReportsConversationPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const formattedRows = data.conversation.map(
    (conversation) => ({
      ...conversation,
      highPriority: conversation.highPriority ? "Yes" : "No",
    })
  );

  const columnKeys = {
    submitted: "Date",
    ra: "RA",
    residentName: "Resident",
    level: "Level",
    highPriority: "High Priority",
  };
  const rowKeys = {
    ...columnKeys,
    sentiment: "General Tone",
    explanation: "Description",
  };

  return (
    <Table
      columnKeys={columnKeys}
      rows={formattedRows}
      search={{
        placeholder: "Search for a conversation report...",
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Conversation Report" />
      )}
      mixins={{
        cells: {
          highPriority: (row) => {
            const { highPriority } = row;
            const color =
              highPriority === "Yes" ? "bg-red-700" : "bg-green-700";
            return (
              <div
                className={`flex ${color} h-6 px-2 items-center rounded-full w-fit`}
              >
                <p className="text-xs text-white">{highPriority}</p>
              </div>
            );
          },
        },
      }}
      ActionButtons={({ rows }) => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(rows, "Conversations", rowKeys);
            }}
          >
            Export Conversation Reports
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
