import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import type { ICompleteRCI } from "~/models/rci";
import {
  readCompleteRCIsAdmin,
  readCompleteRCIsRD,
} from "~/repositories/rci/complete";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [completeRCIs] = await Promise.all([
    admin ? readCompleteRCIsAdmin() : readCompleteRCIsRD(user.id),
    delay(100),
  ]);
  return json({
    completeRCIs,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "update":
      throw new Error("TODO: add read update");
  }
}

export default function StaffRCIsCompletePage() {
  const context = useOutletContext<IBuildingDropdown[]>();
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    submittedOn: "Submitted",
    ra: "RA",
    room: "Room",
    totalIssues: "Issues",
  };
  const rowKeys = {
    door: "Door",
    closet: "Closet",
    bed: "Bed",
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
    <Table<ICompleteRCI>
      columnKeys={columnKeys}
      rows={data.completeRCIs}
      search={{
        placeholder: "Search for a complete RCI...",
      }}
      filter={{
        selected: "All",
        key: "buildingId",
        options: buildingOptions,
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
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select an RCI" />
      )}
      ActionButtons={({ rows }) => (
        <IconButton
          Icon={Download}
          className="md:w-fit w-full"
          onClick={() => {
            csv.download(rows, "Complete_RCIs", rowKeys);
          }}
        >
          Export Complete RCIs
        </IconButton>
      )}
    />
  );
}
