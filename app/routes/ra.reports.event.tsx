import { json, useLoaderData, useOutletContext } from "@remix-run/react";

import IconButton from "~/components/common/IconButton";
import { Download, FileSearch, Plus } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { csv } from "~/utilties/csv";
import { ActionFunctionArgs } from "@remix-run/node";
import { delay } from "~/utilties/delay.server";
import { auth } from "~/utilties/auth.server";
import { createEvent, readEventReportsRA } from "~/repositories/reports/event";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import EventForm from "~/components/forms/EventForm";
import { IUser } from "~/models/user";
import { IEventReport } from "~/models/reports";
import DeleteForm from "~/components/forms/DeleteForm";

export async function loader({ request }: ActionFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [events] = await Promise.all([readEventReportsRA(user.id), delay(100)]);
  return json({
    events,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["ra"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createEvent(values, request);
  }
}

export default function AdminReportsRoundPage() {
  const context = useOutletContext<{
    user: IUser;
  }>();
  const data = useLoaderData<typeof loader>();
  const columnKeys = {
    time: "Time",
    ra: "Resident Assistant",
    attendance: "Attendance",
  };
  const rowKeys = {
    ...columnKeys,
    description: "Description",
  };

  return (
    <Table<IEventReport>
      columnKeys={columnKeys}
      rows={data.events}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for an event...",
      }}
      InstructionComponent={() => (
        <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
          <FileSearch className="w-7 h-7" />
          <h2 className="text-xl font-bold">First Select a Event</h2>
        </div>
      )}
      EditComponent={({ row }) => (
        <EventForm zoneId={context.user.id} event={row} />
      )}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title="Delete Event Report"
          prompt="Are you sure you want to delete this event report?"
        />
      )}
      ActionButtons={() => (
        <div className="ml-auto order-2 flex space-x-3 h-12">
          <DrawerProvider>
            <DrawerButton>
              <IconButton Icon={Plus}>Add Event</IconButton>
            </DrawerButton>
            <DrawerContent>
              <EventForm zoneId={context.user.id} />
            </DrawerContent>
          </DrawerProvider>
          <IconButton
            Icon={Download}
            onClick={() => {
              csv.download([], "events", rowKeys);
            }}
          >
            Export Events
          </IconButton>
        </div>
      )}
    />
  );
}
