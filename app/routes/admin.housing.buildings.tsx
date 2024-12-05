import { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import {
  DrawerProvider,
  DrawerButton,
  DrawerContent,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, HomeSearch, Plus } from "~/components/common/Icons";
import Search from "~/components/common/Search";
import Table from "~/components/common/Table";
import useSearch from "~/hooks/useSearch";
import { db } from "~/utilties/server/database/connection";
import { buildingTable } from "~/utilties/server/database/schema";
import { csv } from "~/utilties/client/csv";
import { useToastContext } from "~/components/common/Toast";
import DeleteForm from "~/components/forms/DeleteForm";
import BuildingForm from "~/components/forms/BuildingForm";
import { buildings } from "~/repositories/housing";
import { rdsDropdown } from "~/repositories/people";
import type { IBuilding } from "~/models/housing";
import { Building } from "~/schemas/building";

export async function loader() {
  return json({
    buildings: await buildings(),
    rds: await rdsDropdown(),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);
  if (intent === "create") {
    const building = Building.safeParse(values);

    if (building.success) {
      await db.insert(buildingTable).values(building.data);
    }
  } else if (intent === "delete") {
    await db
      .delete(buildingTable)
      .where(eq(buildingTable.id, Number(values["id"])));
  }

  return redirect(request.url);
}

export default function AdminBuldingsPage() {
  const data = useLoaderData<typeof loader>();

  const { handleSearch, filteredData } = useSearch(data.buildings);
  const toast = useToastContext();
  return (
    <section className="space-y-5">
      <div className="flex">
        <Search
          placeholder="Search for a building..."
          handleSearch={handleSearch}
        />
        <div className="ml-auto order-2 flex space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <BuildingForm rds={data.rds} />
            </DrawerContent>
            <DrawerButton>
              <IconButton Icon={Plus}>Add Building</IconButton>
            </DrawerButton>
            <IconButton
              Icon={Download}
              onClick={() => {
                csv(filteredData || data.buildings, "buildings");
                toast.success("Buildings Exported");
              }}
            >
              Export
            </IconButton>
          </DrawerProvider>
        </div>
      </div>
      <Table<IBuilding>
        columnKeys={{
          name: "Name",
          rd: "RD",
        }}
        rows={filteredData || data.buildings}
        rowKeys={{
          name: "Name",
          rd: "RD",
        }}
        InstructionComponent={() => (
          <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
            <HomeSearch className="w-7 h-7" />
            <h2 className="text-xl font-bold">First Open a Building</h2>
          </div>
        )}
        EditComponent={({ row }) => (
          <BuildingForm building={row} rds={data.rds} />
        )}
        DeleteComponent={({ row }) => (
          <DeleteForm id={row.id} title={row.name} />
        )}
      />
    </section>
  );
}
