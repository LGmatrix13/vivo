import { json, useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch, Plus } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import { auth } from "~/utilties/auth.server";
import {
  createConversation,
  deleteConversation,
  readConversationReportsAsRA,
  updateConversation,
} from "~/repositories/reports/conversation";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import { IUser } from "~/models/user";
import ConversationForm from "~/components/forms/ConversationForm";
import { readResidentsDropdownAsRA } from "~/repositories/people/residents";
import DeleteForm from "~/components/forms/DeleteForm";
import { IConversationReportAsRA } from "~/models/reports";

export async function loader({ request }: ActionFunctionArgs) {
  const ra = await auth.readUser(request, ["ra"]);
  const [conversations, residentsDropdown] = await Promise.all([
    readConversationReportsAsRA(ra.id),
    readResidentsDropdownAsRA(ra.id),
    delay(100),
  ]);
  return json({
    conversations,
    residentsDropdown,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["ra"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createConversation(values, request);
    case "update":
      return await updateConversation(values, request);
    case "delete":
      return await deleteConversation(values, request);
  }
}

export default function AdminReportsRoundPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<{
    user: IUser;
  }>();
  const columnKeys = {
    submitted: "Submitted",
    resident: "Resident",
    level: "Level",
    highPriority: "High Priority",
  };
  const rowKeys = {
    ...columnKeys,
    sentiment: "General Tone",
    explanation: "Description",
  };



  return (
    <Table<IConversationReportAsRA>
      columnKeys={columnKeys}
      rows={data.conversations}
      search={{
        placeholder: "Search for a conversation...",
      }}
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
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
          <FileSearch className="w-7 h-7" />
          <h2 className="text-xl font-bold">First Select a Conversation</h2>
        </div>
      )}
      EditComponent={({ row }) => (
        <ConversationForm
          residentsDropdown={data.residentsDropdown}
          conversation={row}
          zoneId={context.user.id}
        />
      )}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title="Delete Conversation"
          prompt="Are you sure you want to delete this conversation?"
        />
      )}
      ActionButtons={({ rows }) => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <DrawerProvider>
            <DrawerButton>
              <IconButton Icon={Plus}>Add Conversation</IconButton>
            </DrawerButton>
            <DrawerContent>
              <ConversationForm
                zoneId={context.user.id}
                residentsDropdown={data.residentsDropdown}
              />
            </DrawerContent>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(rows, "Residents", rowKeys);
            }}
          >
            Export Conversations
          </IconButton>
        </div>
      )}
    />
  );
}
