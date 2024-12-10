import { ActionFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
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
import { csv } from "~/utilties/csv";
import DeleteForm from "~/components/forms/DeleteForm";
import BuildingForm from "~/components/forms/BuildingForm";
import {
  createBuilding,
  deleteBuilding,
  readBuildings,
  updateBuilding,
} from "~/repositories/housing/buildings";
import { readRDsDropdown } from "~/repositories/people/rds";
import type { IBuilding } from "~/models/housing";

export async function loader() {
  const parallelized = await Promise.all([readBuildings(), readRDsDropdown()]);
  return json({
    buildings: parallelized[0],
    rds: parallelized[1],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createBuilding(values, request);
    case "delete":
      return await deleteBuilding(values, request);
    case "update":
      return await updateBuilding(values, request);
  }
}

export default function AdminBuldingsPage() {
  const data = useLoaderData<typeof loader>();
  const { handleSearch, filteredData } = useSearch(data.buildings, []);

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
                csv.download(filteredData || data.buildings, "buildings");
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
          <DeleteForm
            id={row.id}
            title={`Delete ${row.name}`}
            prompt={`Are you sure you want to delete ${row.name}?`}
            toast={`Deleted ${row.name}`}
          />
        )}
      />
    </section>
  );
}
