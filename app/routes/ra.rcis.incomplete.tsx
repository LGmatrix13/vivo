import { useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { IIncompleteRCI } from "~/models/rci";
import { readIncompleteRCIsAsRA } from "~/repositories/rci/incomplete";
import { auth } from "~/utilties/auth.server";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { upperCampusMapping } from "~/mappings/rci";
import { getRoomRCIDraftData, updateRoom, updateRoomIssues } from "~/repositories/housing/rooms";
import RCIDraftForm from "~/components/forms/RCIDraftForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [incompleteRCIs] = await Promise.all([
    readIncompleteRCIsAsRA(user.id),
    delay(100),
  ]);
  let issuesMap: Record<number, Record<string, string>> = {};
  for (let i = 0; i < incompleteRCIs.length; i++) {
    issuesMap[incompleteRCIs[i].roomId] = (await getRoomRCIDraftData(incompleteRCIs[i].roomId)).issues
  }
  return {
    incompleteRCIs,
    issuesMap,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["ra"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  let cleanedIssues: {[key: string]: string} = {}
  for (const key of Object.keys(values)) {
    if (!key.startsWith("condition") && key != "id") {
      cleanedIssues[key] = values[key] as string
    }
  }

  const id = parseInt(values["id"] as string)

  const cleanedVals = {id: id, issuesRCI: JSON.stringify(cleanedIssues)};

  switch (intent) {
    case "update":
      return await updateRoomIssues(cleanedVals, request);
  }
}

export default function RARCIsIncompletePage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    resident: "Resident",
    room: "Room",
  };
  const rowKeys = {
    ...columnKeys,
  };

  return (
    <Table<IIncompleteRCI>
      columnKeys={columnKeys}
      rows={data.incompleteRCIs as IIncompleteRCI[]}
      search={{
        placeholder: "Search for an incomplete RCI...",
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select an RCI" />
      )}
      EditComponent={({ row }) =>
        <RCIDraftForm
          roomId={row.roomId}
          mapping={upperCampusMapping}
          issues={data.issuesMap[row.roomId]}  
        />
      }
      ActionButtons={({ rows }) => (
        <IconButton
          Icon={Download}
          className="md:w-fit w-full"
          onClick={() => {
            csv.download(rows, "Incomplete_RCIs", rowKeys);
          }}
        >
          Export Incomplete RCIs
        </IconButton>
      )}
    />
  );
}
