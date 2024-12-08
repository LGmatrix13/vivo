import type { IBuilding } from "~/models/housing";
import Form from "../common/Form";
import Input from "../common/Input";
import Select from "../common/Select";
import { IRDDropdown } from "~/models/people";

interface BuildingFormProps {
  rds: IRDDropdown[];
  building?: IBuilding;
}

export default function BuildingForm(props: BuildingFormProps) {
  const { building, rds } = props;
  const options = rds.map((option) => {
    return {
      key: option.rd,
      value: option.id,
    };
  });
  return (
    <Form toast="Saved Building" button="Save Building" intent="create">
      <h2 className="font-bold text-xl">
        {building ? `Edit ${building.name}` : "Add Building"}
      </h2>
      {building && <input name="id" type="hidden" value={building?.id} />}
      <Input
        label="Name"
        placeholder="Name"
        name="name"
        type="text"
        value={building?.name}
        required
      />
      <Select
        label="RD"
        name="staffId"
        options={options}
        selected={building?.staffId}
        required
      />
      <Input
        label="Latitude"
        placeholder="Latitude"
        name="latitude"
        type="number"
        defaultValue={building?.latitude || undefined}
        required
      />
      <Input
        label="Longitude"
        placeholder="Longitude"
        name="longitude"
        type="number"
        defaultValue={building?.longitude || undefined}
        required
      />
    </Form>
  );
}
