import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Sparkles } from "~/components/common/Icons";
import InsightsTable from "~/components/common/InsightsTable";
import { IInsight } from "~/models/insights";
import {
  readConversationInsightsCountAsAdmin,
  readConversationInsightsCountAsRD,
  readConversationInsightsHighPriorityCountAsAdmin,
  readConversationInsightsHighPriorityCountAsRD,
  readConversationInsightsLevelThreeAsAdmin,
  readConversationInsightsLevelThreeCountAsRD,
} from "~/repositories/insights/conversation";
import {
  readEventInsightsCountAsRD,
  readEventInsightsAttendanceAsAdmin,
  readEventInsightsAttendanceAsRD,
  readEventInsightsCountAsAdmin,
} from "~/repositories/insights/event";
import {
  readRAHealthInsightsAsAdmin,
  readRAHealthInsightsAsRD,
} from "~/repositories/insights/raHealth";

import {
  readRCIInsightsAsAdmin,
  readRCIInsightsAsRD,
} from "~/repositories/insights/rci";
import {
  readRoundReportInsightsOutstandingWorkOrdersAsAdmin,
  readRoundReportInsightsOutstandingWorkOrdersAsRD,
  readRoundReportInsightsViolationsAsAdmin,
  readRoundReportInsightsViolationsAsRD,
} from "~/repositories/insights/round";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [
    conversationCountInsight,
    conversationHighPriorityInsight,
    conversationLevelThreeInsight,
    eventCountInsight,
    eventAttendanceInsight,
    rciInsights,
    roundOutstandingWorkOrdersInsight,
    roundViolationsInsight,
    raHealthInsights,
  ] = await Promise.all(
    admin
      ? [
          readConversationInsightsCountAsAdmin(),
          readConversationInsightsHighPriorityCountAsAdmin(),
          readConversationInsightsLevelThreeAsAdmin(),
          readEventInsightsCountAsAdmin(),
          readEventInsightsAttendanceAsAdmin(),
          readRCIInsightsAsAdmin(),
          readRoundReportInsightsOutstandingWorkOrdersAsAdmin(),
          readRoundReportInsightsViolationsAsAdmin(),
          readRAHealthInsightsAsAdmin(),
        ]
      : [
          readConversationInsightsCountAsRD(user.id),
          readConversationInsightsHighPriorityCountAsRD(user.id),
          readConversationInsightsLevelThreeCountAsRD(user.id),
          readEventInsightsCountAsRD(user.id),
          readEventInsightsAttendanceAsRD(user.id),
          readRCIInsightsAsRD(user.id),
          readRoundReportInsightsOutstandingWorkOrdersAsRD(user.id),
          readRoundReportInsightsViolationsAsRD(user.id),
          readRAHealthInsightsAsRD(user.id),
        ]
  );
  const conversationInsights = [
    conversationCountInsight,
    conversationHighPriorityInsight,
    conversationLevelThreeInsight,
  ] as IInsight[];
  const eventInsights = [
    eventCountInsight,
    eventAttendanceInsight,
  ] as IInsight[];
  const roundInsights = [
    roundOutstandingWorkOrdersInsight,
    roundViolationsInsight,
  ] as IInsight[];
  return {
    conversationInsights,
    eventInsights,
    rciInsights: rciInsights as IInsight[],
    roundInsights,
    raHealthInsights: raHealthInsights as IInsight[],
  };
}

export default function StaffInsightsLayout() {
  const {
    conversationInsights,
    eventInsights,
    rciInsights,
    roundInsights,
    raHealthInsights,
  } = useLoaderData<typeof loader>();

  console.log(roundInsights)

  return (
    <InsightsTable
      rows={[
        {
          category: "Conversations",
          insights: conversationInsights,
        },
        {
          category: "Events",
          insights: eventInsights,
        },
        {
          category: "On Duty",
          insights: roundInsights,
        },
        {
          category: "RCIs",
          insights: rciInsights,
        },
        {
          category: "RA Health",
          insights: raHealthInsights,
        },
      ]}
      ActionButtons={() => (
        <Link to="/staff/merrick">
          <IconButton Icon={Sparkles}>Ask Merrick</IconButton>
        </Link>
      )}
    />
  );
}
