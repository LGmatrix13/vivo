import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ScheduleTable from "~/components/common/ShiftTable";
import DeleteForm from "~/components/forms/DeleteForm";
import ZoneShiftForm from "~/components/forms/ZoneShiftForm";
import { IZoneShift } from "~/models/shifts";
import {
  readBuildingsDropdownAsAdmin,
  readBuildingsDropdownAsRD,
} from "~/repositories/housing/buildings";
import {
  readRAsDropdownAsAdmin,
  readRAsDropdownAsRD,
} from "~/repositories/people/ras";
import {
  createRAShift,
  deleteRAShift,
  readShiftsRAAsAdmin,
  readShiftsRAAsRD,
  updateRAShift,
} from "~/repositories/shifts/ra";
import { auth } from "~/utilties/auth.server";
import { delay } from "~/utilties/delay.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["admin", "rd"]);
  const admin = user.role === "admin";
  const [shifts, buildingsDropdown, rasDropdown] = await Promise.all([
    admin ? readShiftsRAAsAdmin() : readShiftsRAAsRD(user.id),
    admin ? readBuildingsDropdownAsAdmin() : readBuildingsDropdownAsRD(user.id),
    admin ? readRAsDropdownAsAdmin() : readRAsDropdownAsRD(user.id),
    delay(100),
  ]);
  return json({
    shifts,
    buildingsDropdown,
    rasDropdown,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.rejectUnauthorized(request, ["admin", "rd"]);

  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);

  switch (intent) {
    case "upload":
    // TODO
    case "create":
      return await createRAShift(request, values);
    case "update":
      return await updateRAShift(request, values);
    case "delete":
      return await deleteRAShift(request, values);
  }
}

export default function StaffShiftsRAPage() {
  const data = useLoaderData<typeof loader>();
  const buildingOptions = [
    {
      value: 0,
      key: "All",
    },
    ...data.buildingsDropdown.map((building) => {
      return {
        value: building.id,
        key: building.name,
      };
    }),
  ];

  return (
    <ScheduleTable<IZoneShift>
      shifts={data.shifts}
      filter={{
        options: buildingOptions,
      }}
      AddShiftComponent={() => <ZoneShiftForm raDropdown={data.rasDropdown} />}
      EditShiftComponent={({ shift }) => (
        <ZoneShiftForm raDropdown={data.rasDropdown} shift={shift} />
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
