import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Door, Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
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
  releaseRCIsForCheckout,
  updateSubmittedRCIStatus,
} from "~/repositories/rci/submitted";
import WideButton from "~/components/common/WideButton";
import { ISubmittedRCI } from "~/models/rci";
import { DrawerButton, DrawerContent, DrawerProvider } from "~/components/common/Drawer";
import ReleaseAllRCIsForm from "~/components/forms/ReleaseAllRCIsForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [completeRCIs] = await Promise.all([
    admin
      ? readSubmittedRCIsAsAdmin("ACTIVE")
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
          reportType: "RCI_ACTIVE",
          personType: admin ? "ADMIN" : "STAFF",
        },
        request
      );
    case "update.status":
      return await updateSubmittedRCIStatus(request, values);
    case "updateAll":
      return await releaseRCIsForCheckout(request, values);
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
    <Table<ISubmittedRCI>
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
        <div className="flex flex-wrap gap-3">
          <DrawerProvider>
            <DrawerContent>
              <ReleaseAllRCIsForm
                rciIds={rows.map(rows => rows.id)}
                title={"Release All RCIs for Checkout"}
                prompt={'Are you sure you want to release all RCIs for checkout?'}
                toast={'Released ASll RCIs for Checkout'}
              />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Door} className="md:w-fit w-full">
                Release All RCIs for Checkout
              </IconButton>
            </DrawerButton>
            <IconButton
              Icon={Download}
              className="md:w-fit w-full"
              onClick={() => {
                csv.download(rows, "Complete_RCIs", columnKeys);
              }}
            >
              Export Active RCIs
            </IconButton>
          </DrawerProvider>
        </div>
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
          <div className="space-y-3">
            <WideButton onClick={() => {}}>Send to Limble</WideButton>
            <WideButton
              onClick={() => {
                fetcher.submit(
                  {
                    intent: "update.status",
                    id: row.id,
                    status: "RESIDENT_CHECKOUT",
                  },
                  {
                    method: "POST",
                  }
                );
              }}
            >
              Release for Checkout
            </WideButton>
          </div>
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
