import {
  json,
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";

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
  readConversationReports,
  readConversationReportsAsRD,
} from "~/repositories/reports/conversation";
import { readRAsAsAdmin, readRAsAsRD } from "~/repositories/people/ras";
import { createReadReport } from "~/repositories/read/reports";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [conversation, ras] = await Promise.all([
    admin ? readConversationReports() : readConversationReportsAsRD(user.id),
    admin ? readRAsAsAdmin() : readRAsAsRD(user.id),
    delay(100),
  ]);
  return json({
    conversation,
    ras,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
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
          personType: admin ? "ADMIN" : "STAFF",
        },
        request
      );
  }
}

export default function StaffReportsConversationPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<IBuildingDropdown[]>();
  const fetcher = useFetcher();
  const formattedRows = data.conversation.map((conversation) => ({
    ...conversation,
    highPriority: conversation.highPriority ? "Yes" : "No",
  }));

  const columnKeys = {
    time: "Date",
    ra: "RA",
    resident: "Resident",
    level: "Level",
    highPriority: "High Priority",
  };
  const rowKeys = {
    ...columnKeys,
    sentiment: "General Tone",
    explanation: "Description",
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
      rows={formattedRows}
      search={{
        placeholder: "Search for a conversation...",
      }}
      filter={{
        key: "buildingId",
        options: buildingOptions,
        selected: "All",
      }}
      rowKeys={rowKeys}
      enableReads={true}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Conversation" />
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
        <IconButton
          Icon={Download}
          className="md:w-fit w-full"
          onClick={() => {
            csv.download(rows, "Conversations", rowKeys);
          }}
        >
          Export Conversation Reports
        </IconButton>
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
