import {
  json,
  useFetcher,
  useLoaderData,
  useOutletContext,
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
  createWeekly,
  readWeeklyReports,
  readWeeklyReportsAsRD,
  updateWeekly,
} from "~/repositories/reports/weekly";
import { readRAsAsAdmin, readRAsAsRD } from "~/repositories/people/ras";
import { IWeeklyReport } from "~/models/reports";
import { createReadReport } from "~/repositories/read/reports";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [weekly, ras] = await Promise.all([
    admin ? readWeeklyReports() : readWeeklyReportsAsRD(user.id),
    admin ? readRAsAsAdmin() : readRAsAsRD(user.id),
    delay(100),
  ]);

  return json({
    weekly,
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
      return await createWeekly(values, request);
    case "update":
      return await updateWeekly(values, request);
    case "create.read":
      return await createReadReport(
        {
          ...values,
          personId: user.id,
          reportType: "WEEKLY",
          personType: admin ? "ADMIN" : "STAFF",
        },
        request
      );
  }
}

export default function StaffReportsWeeklyPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<IBuildingDropdown[]>();
  const fetcher = useFetcher();
  const columnKeys = {
    submitted: "Date",
    ra: "RA",
  };
  const rowKeys = {
    ...columnKeys,
    raResponsibilities: "RA Responsibilities",
    academics: "Academics",
    spiritualHealth: "Spiritual Health",
    physicalHealth: "Physical Health",
    mentalHealth: "Mental Health",
    personalLife: "Personal Life",
    technologyAndMedia: "Technology and Media",
    explainChoices: "Explain your Choices",
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
    <Table<IWeeklyReport>
      columnKeys={columnKeys}
      rows={data.weekly as IWeeklyReport[]}
      search={{
        placeholder: "Search for a weekly report...",
      }}
      enableReads={true}
      filter={{
        key: "buildingId",
        selected: "All",
        options: buildingOptions,
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Weekly" />
      )}
      ActionButtons={({ rows }) => (
        <IconButton
          Icon={Download}
          onClick={() => {
            csv.download(rows, "Weeklys", rowKeys);
          }}
          className="md:w-fit w-full"
        >
          Export Weekly Reports
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
