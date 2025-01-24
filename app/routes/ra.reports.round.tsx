import { json, useLoaderData, useOutletContext } from "@remix-run/react";
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
  readRoundReportsAsRA,
  updateRound,
} from "~/repositories/reports/round";
import { IRoundReport } from "~/models/reports";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [round] = await Promise.all([
    readRoundReportsAsRA(user.id),
    delay(100),
  ]);
  return json({
    round,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["ra"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createRound(values, request);
    case "update":
      return await updateRound(values, request);
  }
}

export default function RAReportsRoundPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    submitted: "Date",
    time: "Time",
    ra: "RA",
  };
  const rowKeys = {
    ...columnKeys,
    description: "Description",
  };

  return (
    <Table<IRoundReport>
      columnKeys={columnKeys}
      rows={data.round as IRoundReport[]}
      search={{
        placeholder: "Search for a round report...",
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Round Report" />
      )}
      ActionButtons={({ rows }) => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(rows, "Rounds", rowKeys);
            }}
          >
            Export Round Reports
          </IconButton>
        </div>
      )}
    />
  );
}
