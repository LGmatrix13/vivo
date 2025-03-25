import {
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
  createRound,
  readRoundReports,
  readRoundReportsAsRD,
  updateRound,
} from "~/repositories/reports/round";
import { readRAsAsAdmin, readRAsAsRD } from "~/repositories/people/ras";
import { IRoundReport } from "~/models/reports";
import { createReadReport } from "~/repositories/read/reports";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [round, ras] = await Promise.all([
    admin ? readRoundReports() : readRoundReportsAsRD(user.id),
    admin ? readRAsAsAdmin() : readRAsAsRD(user.id),
    delay(100),
  ]);
  return {
    round,
    ras,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createRound(values, request);
    case "update":
      return await updateRound(values, request);
    case "create.read":
      return await createReadReport(
        {
          ...values,
          personId: user.id,
          reportType: "ROUND",
          personType: admin ? "ADMIN" : "STAFF",
        },
        request
      );
  }
}

export default function StaffReportsRoundPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<IBuildingDropdown[]>();
  const fetcher = useFetcher();
  console.log(data)
  const columnKeys = {
    time: "Date",
    ra: "RA",
  };
  const rowKeys = {
    ...columnKeys,
    description: "Description",
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
    <Table<IRoundReport>
      columnKeys={columnKeys}
      rows={data.round as IRoundReport[]}
      search={{
        placeholder: "Search for a round...",
      }}
      filter={{
        key: "buildingId",
        selected: "All",
        options: buildingOptions,
      }}
      enableReads={true}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Round" />
      )}
      ActionButtons={({ rows }) => (
        <IconButton
          Icon={Download}
          className="md:w-fit w-full"
          onClick={() => {
            csv.download(rows, "Rounds", rowKeys);
          }}
        >
          Export Round Reports
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
