import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ScheduleTable from "~/components/common/ShiftTable";
import DeleteForm from "~/components/forms/DeleteForm";
import StaffShiftForm from "~/components/forms/StaffShiftForm";
import { IStaffShift } from "~/models/shifts";
import { readRDsDropdown } from "~/repositories/people/rds";
import { readShiftsRAAsRD } from "~/repositories/shifts/ra";
import {
  createRDShift,
  deleteRDShift,
  readShiftsRDAsAdmin,
  updateRDShift,
} from "~/repositories/shifts/rd";
import { auth } from "~/utilties/auth.server";
import { delay } from "~/utilties/delay.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [shifts, rdsDropdown] = await Promise.all([
    readShiftsRDAsAdmin(),
    admin ? readRDsDropdown() : readRDsDropdown(),
    delay(100),
  ]);
  return json({
    shifts,
    rdsDropdown,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "upload":
    // TODO
    case "create":
      return await createRDShift(request, values);
    case "update":
      return await updateRDShift(request, values);
    case "delete":
      return await deleteRDShift(request, values);
  }
}

export default function StaffShiftsRDPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <ScheduleTable<IStaffShift>
      shifts={data.shifts}
      AddShiftComponent={() => <StaffShiftForm rdDropdown={data.rdsDropdown} />}
      EditShiftComponent={({ shift }) => (
        <StaffShiftForm rdDropdown={data.rdsDropdown} shift={shift} />
      )}
      DeleteShiftComponent={({ shift }) => {
        const { name } = shift;
        return (
          <DeleteForm
            id={shift.id}
            title={`Delete ${name}'s Shift`}
            prompt="Are you sure you want to delete this shift?"
          />
        );
      }}
    />
  );
}
