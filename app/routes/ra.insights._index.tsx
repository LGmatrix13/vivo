import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import InsightsTable from "~/components/common/InsightsTable";
import { auth } from "~/utilties/auth.server";
import { viewEventInsightsPersonal } from "~/repositories/insights/eventInsights";
import { IInsight } from "~/models/insights";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const viewEventsPersonal = await viewEventInsightsPersonal(user.id);
  return {
    viewEventsPersonal,
  };
}

function getLastEventDateLevel(lastEventDate: string): IInsight["level"] {
  const eventDate = new Date(lastEventDate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - eventDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 30) {
    return "danger";
  } else if (diffDays > 15) {
    return "warning";
  } else {
    return "great";
  }
}

export default function RAInsightsPage() {
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    buildingEvents: "Building Events",
    raEvents: "Personal Events",
  };

  return (
    <InsightsTable
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
              title: `Total Events: ${data.viewEventsPersonal.eventCount}`,
              level: "warning",
            },
            {
              title: `Total Attendance: ${data.viewEventsPersonal.totalAttendance}`,
              level: "great",
            },
            {
              title: data.viewEventsPersonal.lastEventDate
                ? getLastEventDateLevel(data.viewEventsPersonal.lastEventDate) === "great"
                  ? `You hosted an event recently!`
                  : getLastEventDateLevel(data.viewEventsPersonal.lastEventDate) === "warning"
                  ? "You have not hosted an event in a while."
                  : "You have not hosted an event in a long time."
                : "unknown",
              level: data.viewEventsPersonal.lastEventDate
                ? getLastEventDateLevel(data.viewEventsPersonal.lastEventDate)
                : "unknown",
            },
          ],
        },
      ]}
    />
  );
}
