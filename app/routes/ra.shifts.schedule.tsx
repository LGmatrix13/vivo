import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ScheduleTable from "~/components/common/ShiftTable";
import { IZoneShift } from "~/models/shifts";
import {
  createRAShift,
  deleteRAShift,
  updateRAShift,
  readShiftsRAAsRA,
} from "~/repositories/shifts/ra";
import { auth } from "~/utilties/auth.server";
import { delay } from "~/utilties/delay.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const [shifts] = await Promise.all([readShiftsRAAsRA(user.id), delay(100)]);
  return json({
    shifts,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "create":
      return await createRAShift(request, values);
  }
}

export default function RAShiftsSchedulePage() {
  const data = useLoaderData<typeof loader>();

  return <ScheduleTable<IZoneShift> shifts={data.shifts} />;
}
