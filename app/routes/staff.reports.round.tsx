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
  readRoundReports,
  readRoundReportsAsRD,
  updateRound,
} from "~/repositories/reports/round";
import { readRAsAsAdmin, readRAsAsRD } from "~/repositories/people/ras";
import { IRoundReport } from "~/models/reports";
import { useState } from "react";
import { createReadReport } from "~/repositories/ReadReports/readReports";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [round, ras] = await Promise.all([
    admin ? readRoundReports() : readRoundReportsAsRD(user.id),
    admin ? readRAsAsAdmin() : readRAsAsRD(user.id),
    delay(100),
  ]);
  return json({
    round,
    ras,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createRound(values, request);
    case "update":
      return await updateRound(values, request);
    case "create.read":
      return await createReadReport(values, request);
  }
}

export default function StaffReportsRoundPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<IBuildingDropdown[]>();
  const columnKeys = {
    submitted: "Date",
    time: "Time",
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
      rows={data.round}
      search={{
        placeholder: "Search for a round...",
      }}
      filter={{
        key: "buildingId",
        selected: "All",
        options: buildingOptions,
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Round" />
      )}
      ActionButtons={({ rows }) => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(rows, "Rounds", rowKeys);
            }}
          >
            Export Rounds
          </IconButton>
        </div>
      )}
    />
  );
}
