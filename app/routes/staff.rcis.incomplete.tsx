import { json, useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { IIncompleteRCI } from "~/models/rci";
import {
  readIncompleteRCIsAsAdmin,
  readIncompleteRCIsAsRD,
} from "~/repositories/rci/incomplete";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";
import { createReadReport } from "~/repositories/ReadReports/readReports";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [incompleteRCIs] = await Promise.all([
    admin ? readIncompleteRCIsAsAdmin() : readIncompleteRCIsAsRD(user.id),
    delay(100),
  ]);
  return json({
    incompleteRCIs,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin"]);
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "update":
      throw new Error("TODO: add read update");
    case "create.read":
              return await createReadReport(
                {
                  ...values,
                  personId: user.id,
                  reportType: "RCI",
                  personType: admin ? "ADMIN" : "STAFF",
                },
                request
              );
  }
}

export default function StaffRCIsIncompletePage() {
  const context = useOutletContext<IBuildingDropdown[]>();
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const columnKeys = {
    ra: "RA",
    resident: "Resident",
    room: "Room",
  };
  const rowKeys = {
    ...columnKeys,
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
    <Table<IIncompleteRCI>
      columnKeys={columnKeys}
      rows={data.incompleteRCIs}
      search={{
        placeholder: "Search for an incomplete RCI...",
      }}
      filter={{
        key: "buildingId",
        selected: "All",
        options: buildingOptions,
      }}
      rowKeys={rowKeys}
      enableReads={true}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select an RCI" />
      )}
      ActionButtons={({ rows }) => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download(rows, "Residents", rowKeys);
            }}
          >
            Export RCIs
          </IconButton>
        </div>
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
