import { IARD, IRDDropdown, IResidentDropdown } from "~/models/people";
import Form from "../common/Form";
import Select from "../common/Select";

interface ARDFormProps {
  ard?: IARD;
  residentDropdown?: IResidentDropdown[];
  rdDropdown: IRDDropdown[];
}

export default function ARDForm(props: ARDFormProps) {
  const { ard, rdDropdown, residentDropdown } = props;

  const rdOptions = rdDropdown.map((option) => {
    return {
      key: option.rd,
      value: option.id,
    };
  });

  const residentOptions = residentDropdown?.map((option) => {
    return {
      key: option.resident,
      value: option.id,
    };
  });

  return (
    <Form
      toast="Saved ARD"
      button="Save ARD"
      intent={ard ? "update" : "create"}
    >
      <h2 className="font-bold text-xl">
        {ard ? `Edit ${ard.fullName}` : "Add ARD"}
      </h2>
      {residentOptions && (
        <Select
          label="Resident"
          name="residentId"
          options={residentOptions}
          explanation="Select a resident to promote to ARD."
        />
      )}
      <Select
        label="RD"
        name="staffId"
        options={rdOptions}
        explanation="The RD this ARD will report to."
      />
    </Form>
  );
}
