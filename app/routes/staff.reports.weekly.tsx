import { json, useLoaderData, useOutletContext } from "@remix-run/react";

import Table from "~/components/common/Table";
import { ActionFunctionArgs } from "@remix-run/node";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import { IBuildingDropdown } from "~/models/housing";
import { FileSearch } from "~/components/common/Icons";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";

  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
    case "update":
  }
}

export default function StaffReportsWeeklyPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<IBuildingDropdown[]>();
  const columnKeys = {
    submittedOn: "Date",
    ra: "RA",
  };
  const rowKeys = {
    ...columnKeys,
    raResponsibilities: "RA Responsibilities",
    academics: "Academics",
    spiritualHealth: "Spiritual Health",
    physicalHealth: "Physical Health",
    mentalHealth: "Mental Health",
    personalLife: "Personal Life",
    technologyAndMedia: "Technology and Media",
    explainChoices: "Explain your Choices",
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
    <Table
      columnKeys={columnKeys}
      rows={[]}
      search={{
        placeholder: "Search for a weekly report...",
      }}
      filter={{
        key: "buildingId",
        selected: "All",
        options: buildingOptions,
      }}
      rowKeys={rowKeys}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select a Weekly" />
      )}
    />
  );
}
