import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Filter from "~/components/common/Filter";
import RAOnDuty from "~/components/common/RAOnDuty";
import RDOnDuty from "~/components/common/RDOnDuty";
import useLocation from "~/hooks/useLocation";
import {
  readBuildingsDropdownAsAdmin,
  readBuildingsDropdownAsRD,
} from "~/repositories/housing/buildings";
import {
  readOnDutyRAAsAdmin,
  readOnDutyRAAsRD,
  readOnDutyRD,
} from "~/repositories/shifts/onDuty";

import { auth } from "~/utilties/auth.server";
import { delay } from "~/utilties/delay.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.readUser(request, ["ra"]);
  const ra = user.role === "ra";
  const [rasOnDuty, rdsOnDuty, buildingsDropdown] = await Promise.all([
    readOnDutyRAAsAdmin(), readOnDutyRD(), readBuildingsDropdownAsAdmin()
  ]);
  return json({
    rasOnDuty,
    rdsOnDuty,
    buildingsDropdown
  });
}

export default function RASchedulesOnDutyPage() {
  const data = useLoaderData<typeof loader>();
  const { location } = useLocation();
  const [selected, setSelected] = useState(0);

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

  function handleFilter(id: number) {
    setSelected(id);
  }

  const rasOnDutyFiltered = data.rasOnDuty.filter(
    (raOnDuty) => !selected || raOnDuty.buildingId == selected
  );

  return (
    <section className="space-y-5">
      <div className="w-fit">
        <Filter
          options={buildingOptions}
          selected={selected}
          handleFilter={handleFilter}
        />
      </div>
      <div className="space-y-3">
        <h2 className="font-bold text-lg">On Duty RD</h2>
        {data.rdsOnDuty.map((rdOnDuty, index) => (
          <RDOnDuty rdOnDuty={rdOnDuty} key={index} />
        ))}
      </div>
      <div className="space-y-3">
        <h2 className="font-bold text-lg">On Duty RAs</h2>
        {rasOnDutyFiltered.map((raOnDuty, index) => (
          <RAOnDuty raOnDuty={raOnDuty} key={index} />
        ))}
      </div>
    </section>
  );
}
