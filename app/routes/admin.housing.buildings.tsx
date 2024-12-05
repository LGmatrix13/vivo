import { ActionFunctionArgs } from "@remix-run/node";
import { defer, json, redirect, useLoaderData } from "@remix-run/react";
import { count, eq, sum, sql, desc, asc } from "drizzle-orm";
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
import { buildingTable, staffTable } from "~/utilties/server/database/schema";
import { csv } from "~/utilties/client/csv";
import { Building } from "~/schemas/building";
import { IBuilding } from "~/models/building";
import { useToastContext } from "~/components/common/Toast";
import DeleteForm from "~/components/forms/DeleteForm";
import BuildingForm from "~/components/forms/BuildingForm";

export async function loader() {
  const buildings = await db
    .select({
      id: buildingTable.id,
      name: buildingTable.name,
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
    })
    .from(buildingTable)
    .innerJoin(staffTable, eq(buildingTable.staffId, staffTable.id))
    .orderBy(buildingTable.name);

  const staff = await db
    .select({
      id: staffTable.id,
      rd: sql<string>`concat(${staffTable.firstName}, ' ', ${staffTable.lastName})`.as(
        "rd"
      ),
    })
    .from(staffTable)
    .orderBy(asc(staffTable.lastName));

  return json({
    buildings: buildings as IBuilding[],
    staff: staff,
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
              <BuildingForm staff={data.staff} />
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
          <BuildingForm building={row} staff={data.staff} />
        )}
        DeleteComponent={({ row }) => (
          <DeleteForm id={row.id} title={row.name} />
        )}
      />
    </section>
  );
}
