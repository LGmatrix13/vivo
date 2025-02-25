import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import InsightsTable from "~/components/common/InsightsTable";
import { readBuildingsDropdownAsAdmin } from "~/repositories/housing/buildings";
import { conversationInsights } from "~/repositories/insights/conversationInsights";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  // TODO: get insights from database

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const buildings = await readBuildingsDropdownAsAdmin();

  const insights = await Promise.all(
    buildings.map(async (building) => ({
      buildingId: building.id,
      buildingName: building.name,
      convoData: await conversationInsights(building.id),
    }))
  );
  

  return { buildings, insights };
  // TODO: return the data from the database and return
}

export default function StaffInsightsLayout() {
  const data = useLoaderData<typeof loader>();
  const {buildings, insights} = useLoaderData<typeof loader>();
  const buildingOptions = [
    {
      value: 0,
      key: "All",
    },
    ...data.buildings.map((building) => {
      return {
        value: building.id,
        key: building.name,
      };
    }),
  ];


  const rows = insights.map((insight) => {
    // Check that the `convoData` is in the expected shape
    const { conversationCount, highPriorityCount, level3Count } = insight.convoData;

    return {
      buildingId: insight.buildingId,
      category: `Conversations - ${insight.buildingName}`,
      insights: [
        {
          level: conversationCount > 10 ? "great" as "great" : conversationCount > 5 ? "warning" as "warning" : "danger" as "danger", // You can set the level dynamically based on data conditions
          title: `Total Conversations: ${conversationCount}`,
        },
        {
          level: highPriorityCount == 0 ? "great" as "great" : highPriorityCount < 3 ? "warning" as "warning": "danger" as "danger", // You can set the level dynamically based on data conditions
          title: `High Priority Conversations: ${highPriorityCount}`,
        },
        {
          level: "warning" as "warning", // You can set the level dynamically based on data conditions
          title: `Total Level 3 Conversations: ${level3Count}`,
        },
      ],
    };
  });

  const filteredRows = []

  return (
    <InsightsTable
      filter={{
        // TODO: pass options to filters. similar/same logic to staff.shifts.ra.
        options: buildingOptions,
      }}
      rows={rows}
    />
  );
}
