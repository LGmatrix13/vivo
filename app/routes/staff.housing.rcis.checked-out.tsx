import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import type { ICompleteRCI } from "~/models/rci";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";
import { createReadReport } from "~/repositories/read/reports";
import {
  colonialDoubleMapping,
  colonialQuadMapping,
  upperCampusMapping,
} from "~/mappings/rci";
import SelectedRow from "~/components/common/SelectedRow";
import {
  readSubmittedRCIsAsAdmin,
  readSubmittedRCIsAsRD,
} from "~/repositories/rci/submitted";
import WideButton from "~/components/common/WideButton";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [completeRCIs] = await Promise.all([
    admin
      ? readSubmittedRCIsAsAdmin("CHECKED_OUT")
      : readSubmittedRCIsAsRD(user.id, "ACTIVE"),
    delay(100),
  ]);
  return {
    completeRCIs,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create.read":
      return await createReadReport(
        {
          ...values,
          personId: user.id,
          reportType: "RCI_CHECKED_OUT",
          personType: admin ? "ADMIN" : "STAFF",
        },
        request
      );
  }
}

export default function StaffHousingRCIsActivePage() {
  const context = useOutletContext<{
    buildingsDropdown: IBuildingDropdown[];
  }>();
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const columnKeys = {
    submitted: "Submitted",
    resident: "Resident",
    ra: "RA",
    room: "Room",
    totalIssues: "Issues",
  };
  const buildingOptions = [
    {
      value: 0,
      key: "All",
    },
    ...context.buildingsDropdown.map((building) => {
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
        placeholder: "Search for an active RCI...",
      }}
      filter={{
        selected: "All",
        key: "buildingId",
        options: buildingOptions,
      }}
      enableReads={true}
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
          <WideButton onClick={() => {}}>Send to Limble</WideButton>
        </SelectedRow>
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
