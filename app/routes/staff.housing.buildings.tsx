import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import {
  DrawerProvider,
  DrawerButton,
  DrawerContent,
} from "~/components/common/Drawer";
import IconButton from "~/components/common/IconButton";
import { Download, HomeSearch, Plus } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import DeleteForm from "~/components/forms/DeleteForm";
import BuildingForm from "~/components/forms/BuildingForm";
import {
  createBuilding,
  deleteBuilding,
  readBuildings as readAdminBuildings,
  updateBuilding,
} from "~/repositories/housing/buildings";
import { readRDsDropdown as readAdminRDsDropdown } from "~/repositories/people/rds";
import type { IBuilding } from "~/models/housing";
import { delay } from "~/utilties/delay.server";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin"]);
  const [buildings, rds] = await Promise.all([
    readAdminBuildings(),
    readAdminRDsDropdown(),
    delay(100),
  ]);
  return json({
    buildings,
    rds,
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

export default function StaffAdminHousingBuildingsPage() {
  const data = useLoaderData<typeof loader>();
  const rowKeys = {
    name: "Name",
    rd: "RD",
  };
  const columnKeys = {
    name: "Name",
    rd: "RD",
  };

  return (
    <Table<IBuilding>
      columnKeys={columnKeys}
      rows={data.buildings}
      search={{
        placeholder: "Search for a building...",
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={HomeSearch} title="First Select a Building" />
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
      ActionButtons={() => (
        <div className="flex flex-row space-x-3">
          <DrawerProvider>
            <DrawerContent>
              <BuildingForm rds={data.rds} />
            </DrawerContent>
            <DrawerButton>
              <IconButton className="md:w-fit w-full" Icon={Plus}>
                Add Building
              </IconButton>
            </DrawerButton>
            <IconButton
              Icon={Download}
              className="md:flex hidden"
              onClick={() => {
                csv.download(data.buildings, "buildings", rowKeys);
              }}
            >
              Export Buildings
            </IconButton>
          </DrawerProvider>
        </div>
      )}
    />
  );
}
