import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Filter from "~/components/common/Filter";
import RAOnDuty from "~/components/common/RAOnDuty";
import RDOnDuty from "~/components/common/RDOnDuty";
import { readBuildingsDropdownAsAdmin } from "~/repositories/housing/buildings";
import {
  readOnDutyRAAsAdmin,
  readOnDutyRD,
} from "~/repositories/shifts/onDuty";
import useLocation from "../hooks/useLocation";
import { locataionSort } from "~/utilties/locationSort";

export async function loader() {
  const [rasOnDuty, rdsOnDuty, buildingsDropdown] = await Promise.all([
    readOnDutyRAAsAdmin(),
    readOnDutyRD(),
    readBuildingsDropdownAsAdmin(),
  ]);
  return {
    rasOnDuty,
    rdsOnDuty,
    buildingsDropdown,
  };
}

export default function RASchedulesOnDutyPage() {
  const data = useLoaderData<typeof loader>();
  const [selected, setSelected] = useState(0);
  const { location, loading, locationGranted } = useLocation();

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

  let sortedRAs = null;
  if (!loading && locationGranted) {
    sortedRAs = locataionSort(
      rasOnDutyFiltered,
      location.latitude,
      location.longitude
    );
  } else if (!loading && !locationGranted) {
    sortedRAs = rasOnDutyFiltered;
  }

  if (sortedRAs) {
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
          {sortedRAs.map((raOnDuty, index) => (
            <RAOnDuty raOnDuty={raOnDuty} key={index} />
          ))}
        </div>
      </section>
    );
  }
}
