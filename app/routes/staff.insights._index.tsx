import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import InsightsTable from "~/components/common/InsightsTable";
import { auth } from "~/utilties/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  // TODO: get insights from database

  // TODO: return the data from the database and return
  return {};
}

export default function StaffInsightsLayout() {
  const data = useLoaderData<typeof loader>();

  return (
    <InsightsTable
      filter={{
        // TODO: pass options to filters. similar/same logic to staff.shifts.ra.
        options: [],
      }}
      rows={[
        // TODO: remove hard coded data. replace with data from the data var above
        {
          category: "Conversations",
          insights: [
            {
              level: "warning",
              title: "Ethan has no conversations",
            },
          ],
        },
      ]}
    />
  );
}
