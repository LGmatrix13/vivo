import { useFetcher, useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import type { ISubmittedRCI } from "~/models/rci";
import {
  readSubmittedRCIsAsRA,
  updateSubmittedRCIStatus,
} from "~/repositories/rci/submitted";
import { auth } from "~/utilties/auth.server";
import {
  colonialDoubleMapping,
  colonialQuadMapping,
  colonialTripleMapping,
  upperCampusMapping,
} from "~/mappings/rci";
import SelectedRow from "~/components/common/SelectedRow";
import WideButton from "~/components/common/WideButton";
import { updateRoomIssues } from "~/repositories/housing/rooms";
import { limble } from "~/utilties/limble.server";
import { WorkOrder } from "~/schemas/limble/workOrder";
import mutate from "~/utilties/mutate.server";

const MAPPINGS = {
  UPPER_CAMPUS: upperCampusMapping,
  COLONIAL_QUAD: colonialQuadMapping,
  COLONIAL_DOUBLE: colonialDoubleMapping,
  COLONIAL_TRIPLE: colonialTripleMapping,
};

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
  await auth.rejectUnauthorized(request, ["ra"]);
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);
  switch (intent) {
    case "update.status":
      await updateRoomIssues(values);
      return await updateSubmittedRCIStatus(request, values);
    case "update.sendToLimble":
      const { data, success, error } = WorkOrder.safeParse(values);
      if (success) {
        const success = await limble.workOrder(
          data.room,
          data.issues,
          MAPPINGS[data.roomType],
          (test) => {
            console.log(test);
            return Promise.resolve(true);
          }
        );
        if (success) {
          return mutate(request.url, {
            message: "Sent to Limble",
            level: "success",
          });
        } else {
          return mutate(request.url, {
            message: "Failed to send to Limble",
            level: "success",
          });
        }
      }
      console.log(error);
      return mutate(request.url, {
        message: "Failed to send to Limble",
        level: "success",
      });
  }
}

export default function RARCIsApproveCheckInPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const columnKeys = {
    submitted: "Submitted",
    room: "Room",
    totalIssues: "Issues",
  };

  return (
    <Table<ISubmittedRCI>
      columnKeys={columnKeys}
      rows={data.completeRCIs as ISubmittedRCI[]}
      search={{
        placeholder: "Search for an active RCI...",
      }}
      mixins={{
        cells: {
          totalIssues: (row) => {
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
        <SelectedRow row={row.issues} keys={MAPPINGS[row.roomType]}>
          <WideButton
            onClick={() => {
              fetcher.submit(
                {
                  intent: "update.sendToLimble",
                  room: row.room,
                  roomType: row.roomType,
                  issues: JSON.stringify(row.issues),
                },
                {
                  method: "POST",
                }
              );
            }}
          >
            Send to Limble
          </WideButton>
        </SelectedRow>
      )}
    />
  );
}
