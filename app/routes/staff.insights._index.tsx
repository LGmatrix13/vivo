import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/react";
import InsightsTable from "~/components/common/InsightsTable";
import { readBuildingsDropdownAsAdmin, readBuildingsDropdownAsRD } from "~/repositories/housing/buildings";
import { auth } from "~/utilties/auth.server";
import { viewEventInsightsBuilding } from "~/repositories/insights/eventInsights";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  // TODO: get insights from database
  const admin = user.role === "admin";
  const buildingsDropdown = admin ? await readBuildingsDropdownAsAdmin() : await readBuildingsDropdownAsRD(user.id);
  const viewEventsBuilding = await viewEventInsightsBuilding(user.id);
  // TODO: return the data from the database and return
  return json({
    buildingsDropdown,
    viewEventsBuilding
  });
}

export default function StaffInsightsLayout() {
  const data = useLoaderData<typeof loader>();
  const buildingOptions = [
    {
      value: 0,
      key: "All",
    },
    ...data.buildingsDropdown.map((building) => {
      return {
        value: building.id,
        key: building.name,
      };
    }),
  ];

  return (
    <InsightsTable
      filter={{
        options: buildingOptions,
      }}
      rows={[
        {
          category: "Health",
          insights: [
            {
              title: `Jack is on arson watch`,
              level: "danger",
            },
          ],
        },
        {
          category: "Conversations",
          insights: [
            {
              title: `Ethan has 0 conversations with residents`,
              level: "warning",
            },
          ],
        },
        {
          category: "Events",
          insights: [
            {
              title: `Total Events: ${data.viewEventsBuilding?.totalEvents ?? 0}`,
              level: "warning",
            },
            {
              title: `Total Attendance: ${data.viewEventsBuilding?.totalAttendance ?? 0}`,
              level: "great",
            }
          ],
        },
      ]}
    />
  );
}

