import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import IconButton from "~/components/common/IconButton";
import { Sparkles } from "~/components/common/Icons";
import InsightsTable from "~/components/common/InsightsTable";
import WideButton from "~/components/common/WideButton";
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
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import ConversationForm from "~/components/forms/ConversationForm";
import { IUser } from "~/models/user";
import { readResidentsDropdownAsRA } from "~/repositories/people/residents";
import RoundForm from "~/components/forms/RoundForm";
import { createRound } from "~/repositories/reports/round";

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
    residentsDropdown,
  ] = await Promise.all([
    readConversationInsightsLastConversatonsAsRA(user.id),
    readEventInsightsCountAsRA(user.id),
    readEventInsightsAttendanceAsRA(user.id),
    readEventInsightsLastEventAsRA(user.id),
    readRCIInsightsAsRA(user.id),
    readRoundReportInsightsOutstandingWorkOrdersAsRA(user.id),
    readRoundReportInsightsViolationsAsRA(user.id),
    readResidentsDropdownAsRA(user.id),
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
    residentsDropdown,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["ra"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createRound(values, request);
  }
}

export default function RAInsightsPage() {
  const {
    lastConversatonsInsights,
    rciInsights,
    roundInsights,
    eventInsights,
    residentsDropdown,
  } = useLoaderData<typeof loader>();

  const context = useOutletContext<{
    user: IUser;
  }>();
  console.log(context);
  return (
    <InsightsTable
      rows={[
        {
          category: "Rounds",
          insights: roundInsights,
          ActionButton: () => (
            <DrawerProvider>
              <DrawerButton>
                <WideButton>Submit a Round Report</WideButton>
              </DrawerButton>
              <DrawerContent>
                <RoundForm zoneId={context.user.id} />
              </DrawerContent>
            </DrawerProvider>
          ),
        },
        {
          category: "Conversations",
          insights: lastConversatonsInsights,
          ActionButton: () => (
            <DrawerProvider>
              <DrawerButton>
                <WideButton>Submit a Conversation Report</WideButton>
              </DrawerButton>
              <DrawerContent>
                {context?.user?.id && residentsDropdown ? (
                  <ConversationForm
                    zoneId={context.user.id}
                    residentsDropdown={residentsDropdown}
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </DrawerContent>
            </DrawerProvider>
          ),
        },
        {
          category: "Events",
          insights: eventInsights,
          ActionButton: () => <WideButton>Submit an Event</WideButton>,
        },
        {
          category: "RCIs",
          insights: rciInsights,
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
