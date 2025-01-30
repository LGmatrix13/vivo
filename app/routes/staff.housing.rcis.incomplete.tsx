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
import { createReadReport } from "~/repositories/read/reports";

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

export default function StaffHousingRCIsIncompletePage() {
  const context = useOutletContext<{
    buildingsDropdown: IBuildingDropdown[];
  }>();
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
    ...context.buildingsDropdown.map((building) => {
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
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select an RCI" />
      )}
      ActionButtons={({ rows }) => (
        <IconButton
          Icon={Download}
          className="md:w-fit w-full"
          onClick={() => {
            csv.download(rows, "Incomplete_RCIs", rowKeys);
          }}
        >
          Export Incomplete RCIs
        </IconButton>
      )}
    />
  );
}
