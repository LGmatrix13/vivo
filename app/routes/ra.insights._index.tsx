import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Sparkles } from "~/components/common/Icons";
import InsightsTable from "~/components/common/InsightsTable";
import { IInsight } from "~/models/insights";
import { readConversationInsightsLastConversatonsAsRA } from "~/repositories/insights/conversation";
import {
  readEventInsightsAttendanceAsRA,
  readEventInsightsCountAsRA,
  readEventInsightsLastEventAsRA,
} from "~/repositories/insights/event";
import { readRCIInsightsAsRA } from "~/repositories/insights/rci";
import {
  readRoundReportInsightsOutstandingWorkOrdersAsRA,
  readRoundReportInsightsViolationsAsRA,
} from "~/repositories/insights/round";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);

  const [
    lastConversatonsInsights,
    eventCountInsight,
    eventAttendanceInsight,
    lastEventInsight,
    rciInsights,
    roundOutstandingWorkOrdersInsight,
    roundViolationsInsight,
  ] = await Promise.all([
    readConversationInsightsLastConversatonsAsRA(user.id),
    readEventInsightsCountAsRA(user.id),
    readEventInsightsAttendanceAsRA(user.id),
    readEventInsightsLastEventAsRA(user.id),
    readRCIInsightsAsRA(user.id),
    readRoundReportInsightsOutstandingWorkOrdersAsRA(user.id),
    readRoundReportInsightsViolationsAsRA(user.id),
  ]);

  const eventInsights = [
    eventCountInsight,
    eventAttendanceInsight,
    lastEventInsight,
  ] as IInsight[];
  const roundInsights = [
    roundOutstandingWorkOrdersInsight,
    roundViolationsInsight,
  ] as IInsight[];
  return {
    lastConversatonsInsights,
    rciInsights,
    roundInsights,
    eventInsights,
  };
}

export default function RAInsightsPage() {
  const {
    lastConversatonsInsights,
    rciInsights,
    roundInsights,
    eventInsights,
  } = useLoaderData<typeof loader>();

  return (
    <InsightsTable
      rows={[
        {
          category: "Conversatons",
          insights: lastConversatonsInsights,
        },
        {
          category: "Rounds",
          insights: roundInsights,
        },
        {
          category: "RCIs",
          insights: rciInsights,
        },
        {
          category: "Events",
          insights: eventInsights,
        },
      ]}
      ActionButtons={() => (
        <Link to="/ra/merrick">
          <IconButton Icon={Sparkles}>Ask Merrick</IconButton>
        </Link>
      )}
    />
  );
}
