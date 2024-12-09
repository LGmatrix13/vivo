import Form from "../common/Form";
import type { IRA, IResidentDropdown } from "~/models/people";
import Select from "../common/Select";
import Input from "../common/Input";
import { IBuildingDropdown } from "~/models/housing";

interface RAFormProps {
  ra?: IRA;
  residentDropdown?: IResidentDropdown[];
  buildingsDropdown: IBuildingDropdown[];
}

export default function RAForm(props: RAFormProps) {
  const { residentDropdown, buildingsDropdown, ra } = props;
  const residentOptions = residentDropdown?.map((option) => {
    return {
      key: option.resident,
      value: option.id,
    };
  });
  const buildingOptions = buildingsDropdown.map((option) => {
    return {
      key: option.name,
      value: option.id,
    };
  });

  return (
    <Form toast="Saved RA" button="Save RA" intent={ra ? "update" : "create"}>
      <h2 className="font-bold text-xl">{ra ? "Edit" : "Add"} RA</h2>
      {ra && <input name="id" type="hidden" value={ra.id} />}
      {residentOptions && (
        <Select
          label="Resident"
          name="residentId"
          explanation="Select someone to promote to RA."
          options={residentOptions}
          selected={ra?.residentId}
          required
        />
      )}
      <Select
        label="Building"
        name="buildingId"
        options={buildingOptions}
        selected={ra?.buildingId}
        required
      />
      <Input label="Zone" name="alias" type="text" value={ra?.alias} required />
    </Form>
  );
}
