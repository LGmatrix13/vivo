import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import InsightsTable from "~/components/common/InsightsTable";
import { readBuildingsDropdownAsAdmin } from "~/repositories/housing/buildings";
import { conversationInsightsAsRD, conversationInsightsAsADMIN } from "~/repositories/insights/conversationInsights";
import { RoundReportInsightsAsADMIN, RoundReportInsightsAsRD } from "~/repositories/insights/roundInsights";
import { auth } from "~/utilties/auth.server";
import { roundReportTable } from "~/utilties/schema.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  // TODO: get insights from database

  const [ConversationInsights, RoundInsights] = await Promise.all([
      admin ? conversationInsightsAsADMIN() : conversationInsightsAsRD(user.id),
      admin ? RoundReportInsightsAsADMIN() : RoundReportInsightsAsRD(user.id)
      //ADD OTHER INSIGHTS HERE JACK

  ]);

  return {ConversationInsights, RoundInsights};
  // TODO: return the data from the database and return
}

export default function StaffInsightsLayout() {
  const data = useLoaderData<typeof loader>();
  const {ConversationInsights, RoundInsights} = useLoaderData<typeof loader>();


  const formattedRows = [{
    category: `Conversations`,
    insights: [
      {
        level: ConversationInsights.conversationCount > 10 ? "great" as "great" : ConversationInsights.conversationCount > 5 ? "warning" as "warning" : "danger" as "danger", // You can set the level dynamically based on data conditions
        title: `Total Conversations: ${ConversationInsights.conversationCount}`,
      },
      {
        level: ConversationInsights.highPriorityCount == 0 ? "great" as "great" : ConversationInsights.highPriorityCount < 3 ? "warning" as "warning": "danger" as "danger", // You can set the level dynamically based on data conditions
        title: `High Priority Conversations: ${ConversationInsights.highPriorityCount}`,
      },
      {
        level: "warning" as "warning", // You can set the level dynamically based on data conditions
        title: `Total Level 3 Conversations: ${ConversationInsights.level3Count}`,
      },
    ],},

    {
    category: `Rounds`,
    insights: [{
      level: "warning" as "warning", // You can set the level dynamically based on data conditions
      title: `Total Violations: ${RoundInsights.violationCount}`,
    },
    {
      level: "danger" as "danger",
      title: `Total Outstanding Work Orders: ${RoundInsights.OutstandingWorkOrderCount}`,
    },]
    },
  
  
  ];


  


  return (
    <InsightsTable
      // filter={{
      //   // TODO: pass options to filters. similar/same logic to staff.shifts.ra.
      //   options: buildingOptions,
      // }}
      rows={formattedRows}
    />
  );
}
