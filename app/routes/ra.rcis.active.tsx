import { useFetcher, useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import type { ICompleteRCI } from "~/models/rci";
import {
  readSubmittedRCIsAsRA,
  updateSubmittedRCIStatus,
} from "~/repositories/rci/submitted";
import { auth } from "~/utilties/auth.server";
import { createReadReport } from "~/repositories/read/reports";
import {
  colonialDoubleMapping,
  colonialQuadMapping,
  upperCampusMapping,
} from "~/mappings/rci";
import SelectedRow from "~/components/common/SelectedRow";
import WideButton from "~/components/common/WideButton";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);

  const [completeRCIs] = await Promise.all([
    readSubmittedRCIsAsRA(user.id, "ACTIVE"),
    delay(100),
  ]);
  return {
    completeRCIs,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);
  switch (intent) {
    case "update.status":
      return await updateSubmittedRCIStatus(request, values);
    case "update.sendToLimble":
      console.log("sent to limble");
      return null;
  }
}

export default function RARCIsAwaitingApprovalPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const columnKeys = {
    submitted: "Submitted",
    room: "Room",
    totalIssues: "Issues",
  };

  return (
    <Table<ICompleteRCI>
      columnKeys={columnKeys}
      rows={data.completeRCIs as ICompleteRCI[]}
      search={{
        placeholder: "Search for a complete RCI...",
      }}
      mixins={{
        cells: {
          totalIssues: (row: ICompleteRCI) => {
            const { totalIssues } = row;
            const color =
              totalIssues > 3
                ? "bg-red-700"
                : totalIssues > 2
                ? "bg-yellow-700"
                : "bg-green-700";
            return (
              <div
                className={`${color} w-6 h-6 rounded-full flex justify-center items-center`}
              >
                <span className="text-xs text-white">{row.totalIssues}</span>
              </div>
            );
          },
        },
      }}
      rowKeys={upperCampusMapping}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select an RCI" />
      )}
      ActionButtons={({ rows }) => (
        <IconButton
          Icon={Download}
          className="md:w-fit w-full"
          onClick={() => {
            csv.download(rows, "Complete_RCIs", columnKeys);
          }}
        >
          Export Complete RCIs
        </IconButton>
      )}
      SelectedRowComponent={({ row }) => (
        <SelectedRow
          row={row.issues}
          keys={
            row.roomType === "UPPER_CAMPUS"
              ? upperCampusMapping
              : row.roomType === "COLONIAL_DOUBLE"
              ? colonialDoubleMapping
              : colonialQuadMapping
          }
        >
          <div className="space-y-3">
            <WideButton
              onClick={() => {
                fetcher.submit(
                  {
                    intent: "update.status",
                    id: row.id,
                    status: "AWAITING_RA",
                  },
                  {
                    method: "POST",
                  }
                );
              }}
            >
              Set back to Awaiting Approval
            </WideButton>
            <WideButton
              onClick={() => {
                fetcher.submit(
                  {
                    intent: "update.sendToLimble",
                    id: row.id,
                  },
                  {
                    method: "POST",
                  }
                );
              }}
            >
              Send to Limble
            </WideButton>
          </div>
        </SelectedRow>
      )}
    />
  );
}
