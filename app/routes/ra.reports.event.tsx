import {
  json,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { Download, FileSearch, Plus } from "~/components/common/Icons";
import Table from "~/components/common/Table";
import { ActionFunctionArgs } from "@remix-run/node";
import Instruction from "~/components/common/Instruction";
import { auth } from "~/utilties/auth.server";
import {
  createEvent,
  deleteEvent,
  readEventReportsRA,
  updateEvent,
} from "~/repositories/reports/event";
import { delay } from "~/utilties/delay.server";
import { IEventReport } from "~/models/reports";
import IconButton from "~/components/common/IconButton";
import { csv } from "~/utilties/csv";
import {
  DrawerButton,
  DrawerContent,
  DrawerProvider,
} from "~/components/common/Drawer";
import EventForm from "~/components/forms/EventForm";
import { IUser } from "~/models/user";
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
    case "update":
      return await updateEvent(values, request);
    case "delete":
      return await deleteEvent(values, request);
  }
}

export default function RAReportsEventPage() {
  const data = useLoaderData<typeof loader>();
  const context = useOutletContext<{
    user: IUser;
  }>();
  const columnKeys = {
    time: "Time",
    ra: "RA",
    attendance: "Attendance",
  };
  const rowKeys = {
    ...columnKeys,
    description: "Description",
  };

  return (
    <Table<IEventReport>
      columnKeys={columnKeys}
      rows={data.events as IEventReport[]}
      rowKeys={rowKeys}
      search={{
        placeholder: "Search for an event report...",
      }}
      InstructionComponent={() => (
        <Instruction Icon={FileSearch} title="First Select an Event Report" />
      )}
      EditComponent={({ row }) => (
        <EventForm event={row} zoneId={context.user.id} />
      )}
      DeleteComponent={({ row }) => (
        <DeleteForm
          id={row.id}
          title="Delete Event"
          prompt="Are you sure you want to delete this event?"
        />
      )}
      ActionButtons={({ rows }) => (
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
              csv.download(rows, "events", rowKeys);
            }}
          >
            Export Events
          </IconButton>
        </div>
      )}
    />
  );
}
