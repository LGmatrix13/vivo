import { IRDDropdown } from "~/models/people";
import Form from "../common/Form";
import { IStaffShift } from "~/models/shifts";
import Select from "../common/Select";
import Input from "../common/Input";

interface StaffShiftFormProps {
  shift?: IStaffShift;
  rdDropdown: IRDDropdown[];
}

export default function StaffShiftForm(props: StaffShiftFormProps) {
  const { shift, rdDropdown } = props;
  const rdOptions = rdDropdown.map((option) => {
    return {
      key: option.rd,
      value: option.id,
    };
  });

  return (
    <Form button="Save Shift" intent={shift ? "update" : "create"}>
      <h2 className="font-bold text-xl">
        {shift ? `Edit ${shift.name}'s Shift` : "Add Shift"}
      </h2>
      {shift && <input name="id" type="hidden" value={shift.id} />}
      {!shift && <Input label="Date" name="date" type="date" required />}
      <Select
        label="RD"
        explanation={
          shift
            ? `Select another RD to swap with ${shift.name}`
            : "Select an RD to serve this shift"
        }
        name="staffId"
        options={rdOptions}
        selected={shift?.staffId}
        required
      />
    </Form>
  );
}
