import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import InsightsTable from "~/components/common/InsightsTable";
import { readBuildingsDropdownAsAdmin } from "~/repositories/housing/buildings";
import { lastConversation } from "~/repositories/insights/conversationInsights";
import { RoundReportInsightsAsRA } from "~/repositories/insights/roundInsights";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  // TODO: get insights from database

    if (!user) {
      throw new Response("Unauthorized", { status: 401 });
    }
  
    console.log(user.id)
  
    const [conversationsInsights, roundInsights] = await Promise.all([
        lastConversation(user.id),
        RoundReportInsightsAsRA(user.id)

    ]);

  // TODO: return the data from the database and return
  return {conversationsInsights,roundInsights};

}

export default function RAInsightsPage() {
  const data = useLoaderData<typeof loader>();
  const {conversationsInsights, roundInsights} = useLoaderData<typeof loader>();
  const rows = conversationsInsights.map((insight) =>{
    return{
        category: "Conversations with " + insight.firstName + " " + insight.lastName,
        insights: [{
            level: "warning" as "warning",
            title: "You havent had a conversation with this individual in over 30 days"
        }]

    }
  }
  )

  return (
    <InsightsTable
      rows={rows}
    />
  );
}
