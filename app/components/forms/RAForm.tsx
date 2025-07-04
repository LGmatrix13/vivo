import Form from "../common/Form";
import type { IRA, IRDDropdown, IResidentDropdown } from "~/models/people";
import Select from "../common/Select";
import Input from "../common/Input";

interface RAFormProps {
  ra?: IRA;
  residentDropdown?: IResidentDropdown[];
  rdsDropdown: IRDDropdown[];
}

/**
 * form to create/delete an RA
 */
export default function RAForm(props: RAFormProps) {
  const { residentDropdown, rdsDropdown, ra } = props;
  const residentOptions = residentDropdown?.map((option) => {
    return {
      key: option.name,
      value: option.id,
    };
  });
  const rdOptions = rdsDropdown.map((option) => {
    return {
      key: option.rd,
      value: option.id,
    };
  });

  console.log(ra);
  return (
    <Form button="Save RA" intent={ra ? "update" : "create"}>
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
        label="RD"
        name="staffId"
        options={rdOptions}
        selected={ra?.staffId}
        required
      />
      <Input
        label="Zone"
        name="alias"
        type="text"
        placeholder="Zone"
        defaultValue={ra?.alias}
        required
      />
    </Form>
  );
}
