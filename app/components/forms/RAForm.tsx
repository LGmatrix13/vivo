import Form from "../common/Form";
import type { IRA, IRDDropdown, IResidentDropdown } from "~/models/people";
import Select from "../common/Select";

interface RAFormProps {
  ra?: IRA;
  residentDropdown?: IResidentDropdown[];
  rdDropdown: IRDDropdown[];
}

export default function RAForm(props: RAFormProps) {
  const { residentDropdown, rdDropdown, ra } = props;
  const residentOptions = residentDropdown?.map((option) => {
    return {
      key: option.resident,
      value: option.id,
    };
  });
  const rdOptions = rdDropdown.map((option) => {
    return {
      key: option.rd,
      value: option.id,
    };
  });
  return (
    <Form toast="Saved RA" button="Save RA" intent={ra ? "update" : "create"}>
      <h2 className="font-bold text-xl">{ra ? "Edit" : "Add"} RA</h2>
      {residentOptions && (
        <Select
          label="Resident"
          name="residentId"
          explanation="Select someone to promote to RA."
          options={residentOptions}
          selected={ra?.residentId}
        />
      )}
      <Select
        label="RD"
        name="staffId"
        explanation="RD this RA will report to."
        options={rdOptions}
        selected={ra?.id}
      />
    </Form>
  );
}
