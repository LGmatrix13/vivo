import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import { Download, FileSearch, Plus } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { ActionFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import {
  createRound,
  deleteRound,
  readRoundReportsAsRA,
  updateRound,
} from "~/repositories/reports/round";
import { IRoundReport } from "~/models/reports";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import { IUser } from "~/models/user";
import RoundForm from "~/components/forms/RoundForm";
import DeleteForm from "~/components/forms/DeleteForm";
import IconButton from "~/components/common/IconButton";
import { csv } from "~/utilties/csv";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [rounds] = await Promise.all([
    readRoundReportsAsRA(user.id),
    delay(100),
  ]);

  return json({
    rounds,
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
    case "delete":
      return await deleteRound(values, request);
  }
}

export default function RAReportsRoundPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<{ user: IUser }>();
  const columnKeys = {
    time: "Time",
  };
  const rowKeys = {
    ...columnKeys,
    description: "Description",
    violations: "Violations",
    outstandingWorkOrders: "Outstanding Work Orders",
  };

  return (
    <Table<IRoundReport>
      columnKeys={columnKeys}
      rows={data.rounds as IRoundReport[]}
      search={{
        placeholder: "Search for a round report...",
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Round Report" />
      )}
      EditComponent={({ row }) => (
        <RoundForm round={row} zoneId={context.user.id} />
      )}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title="Delete Round"
          prompt="Are you sure you want to delete this round?"
        />
      )}
      ActionButtons={({ rows }) => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <DrawerProvider>
            <DrawerButton>
              <IconButton Icon={Plus}>Round Report</IconButton>
            </DrawerButton>
            <DrawerContent>
              <RoundForm zoneId={context.user.id} />
            </DrawerContent>
          </DrawerProvider>
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
