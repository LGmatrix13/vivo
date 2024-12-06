import Form from "../common/Form";
import type { IResident, IResidentDropdown } from "~/models/people";
import Select from "../common/Select";

interface RAFormProps {
  residentDropdown: IResidentDropdown[];
}

export default function RAForm(props: RAFormProps) {
  const { residentDropdown } = props;
  const options = residentDropdown.map((option) => {
    return {
      key: option.resident,
      value: option.id,
    };
  });
  return (
    <Form toast="Saved RA" button="Save RA" intent="create">
      <h2 className="font-bold text-xl">Add RA</h2>
      <Select
        label="Resident"
        name="resident"
        explanation="Select someone to promote to RA"
        options={options}
      />
    </Form>
  );
}
