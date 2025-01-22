import { json, useLoaderData } from "@remix-run/react";

import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import {
  createWeekly,
  readWeeklyReportsAsRA,
  updateWeekly,
} from "~/repositories/reports/weekly";
import { IWeeklyReport } from "~/models/reports";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [weekly] = await Promise.all([
    readWeeklyReportsAsRA(user.id),
    delay(100),
  ]);

  return json({
    weekly,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createWeekly(values, request);
    case "update":
      return await updateWeekly(values, request);
  }
}

export default function StaffReportsWeeklyPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    submittedOn: "Date",
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

  return (
    <Table<IWeeklyReport>
      columnKeys={columnKeys}
      rows={data.weekly}
      search={{
        placeholder: "Search for a weekly report...",
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Weekly Report" />
      )}
      ActionButtons={({ rows }) => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(rows, "Weeklys", rowKeys);
            }}
          >
            Download Weekly Reports
          </IconButton>
        </div>
      )}
    />
  );
}
