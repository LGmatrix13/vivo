import { useFetcher, useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import type { IActiveRCIsAsRA } from "~/models/rci";
import {
  readActiveRCIsAsRA,
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
import { limble } from "~/utilties/limble.server";
import { CreatedWorkOrder, DeletedWorkOrder } from "~/schemas/limble/workOrder";
import mutate from "~/utilties/mutate.server";
import {
  createWorkOrder,
  deleteWorkOrder,
} from "~/repositories/limble/workOrder";

const MAPPINGS = {
  UPPER_CAMPUS: upperCampusMapping,
  COLONIAL_QUAD: colonialQuadMapping,
  COLONIAL_DOUBLE: colonialDoubleMapping,
  COLONIAL_TRIPLE: colonialTripleMapping,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [activeRCIs] = await Promise.all([
    readActiveRCIsAsRA(user.id),
    delay(100),
  ]);
  return {
    activeRCIs,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["ra"]);
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);
  switch (intent) {
    case "update.status":
      return await updateSubmittedRCIStatus(request, values);
    case "create.workOrder":
      const { data: createdWorkOrder, success: createdSuccess } =
        CreatedWorkOrder.safeParse(values);
      if (createdSuccess) {
        const taskId = await limble.createWorkOrder(
          createdWorkOrder.room,
          createdWorkOrder.issues,
          MAPPINGS[createdWorkOrder.roomType]
        );
        if (taskId) {
          await createWorkOrder(createdWorkOrder.roomID, taskId);
          return mutate(request.url, {
            message: "Sent to Limble",
            level: "success",
          });
        }

        return mutate(request.url, {
          message: "Failed to create work",
          level: "success",
        });
      }

      return mutate(request.url, {
        message: "Failed to create work order",
        level: "success",
      });

    case "delete.workOrder":
      const { data: deletedWorkOrder, success: deletedSuccess } =
        DeletedWorkOrder.safeParse(values);
      if (deletedSuccess) {
        const sucess = await limble.deleteWorkOrder(deletedWorkOrder.id);
        await deleteWorkOrder(deletedWorkOrder.id);
        if (sucess) {
          return mutate(request.url, {
            message: "Canceled work order",
            level: "failure",
          });
        }

        return mutate(request.url, {
          message: "Failed to cancel work order",
          level: "success",
        });
      }
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
    <Table<IActiveRCIsAsRA>
      columnKeys={columnKeys}
      rows={data.activeRCIs as IActiveRCIsAsRA[]}
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
          {row.limbleWorkOrderId ? (
            <WideButton
              onClick={() => {
                fetcher.submit(
                  {
                    intent: "delete.workOrder",
                    id: row.limbleWorkOrderId,
                    issues: JSON.stringify(row.issues),
                  },
                  {
                    method: "POST",
                  }
                );
              }}
            >
              Cancel Limble Request
            </WideButton>
          ) : (
            <WideButton
              onClick={() => {
                fetcher.submit(
                  {
                    intent: "create.workOrder",
                    room: row.room,
                    roomId: row.roomId,
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
          )}
        </SelectedRow>
      )}
    />
  );
}
