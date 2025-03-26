import { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Filter from "~/components/common/Filter";
import RAOnDuty from "~/components/common/RAOnDuty";
import { readBuildingsDropdownAsAdmin } from "~/repositories/housing/buildings";
import { readOnDutyRAAsAdmin } from "~/repositories/shifts/onDuty";
import useLocation from "../hooks/useLocation";
import { sortByDistance } from "~/repositories/shifts/sortLocations";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: On Duty" },
    { name: "Vivo: On Duty", content: "RAs on duty page" },
  ];
};

export async function loader() {
  const [rasOnDuty, buildingsDropdown] = await Promise.all([
    readOnDutyRAAsAdmin(),
    readBuildingsDropdownAsAdmin(),
  ]);
  return {
    rasOnDuty,
    buildingsDropdown,
  };
}

export default function ResidentOnDutyPage() {
  const location = useLocation();
  if (!location.loading) {
    console.log(location.location);
  }
  const data = useLoaderData<typeof loader>();
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

  // Sort only if location is available
        const lat = location.location?.latitude
        const long = location.location?.longitude
        const sortedRAs = location
        ? sortByDistance(rasOnDutyFiltered, lat ?? 41.1551691, long ?? -80.0815913)
        : rasOnDutyFiltered;

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
        <h2 className="font-bold text-lg">On Duty RAs</h2>
        {sortedRAs.map((raOnDuty, index) => (
          <RAOnDuty raOnDuty={raOnDuty} key={index} />
        ))}
      </div>
    </section>
  );
}
