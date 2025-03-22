import { useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Download, FileSearch } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { IIncompleteRCI } from "~/models/rci";
import { readIncompleteRCIsAsRA } from "~/repositories/rci/incomplete";
import { auth } from "~/utilties/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [incompleteRCIs] = await Promise.all([
    readIncompleteRCIsAsRA(user.id),
    delay(100),
  ]);
  return {
    incompleteRCIs,
  };
}

export default function RARCIsIncompletePage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    resident: "Resident",
    room: "Room",
  };
  const rowKeys = {
    ...columnKeys,
  };

  return (
    <Table<IIncompleteRCI>
      columnKeys={columnKeys}
      rows={data.incompleteRCIs as IIncompleteRCI[]}
      search={{
        placeholder: "Search for an incomplete RCI...",
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
