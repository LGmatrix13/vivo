import { IRADropdown } from "~/models/people";
import Form from "../common/Form";
import { IZoneShift } from "~/models/shifts";
import Select from "../common/Select";
import Input from "../common/Input";

interface ZoneShiftFormProps {
  shift?: IZoneShift;
  raDropdown: IRADropdown[];
}

export default function ZoneShiftForm(props: ZoneShiftFormProps) {
  const { shift, raDropdown } = props;
  const raOptions = raDropdown
    .filter((option) => !shift || option.buildingId === shift?.buildingId)
    .map((option) => ({
      key: option.name,
      value: option.id,
    }));

  return (
    <Form button="Save Shift" intent={shift ? "update" : "create"}>
      <h2 className="font-bold text-xl">
        {shift ? `Edit ${shift.name}'s Shift` : "Add Shift"}
      </h2>
      {shift && <input name="id" type="hidden" value={shift.id} />}
      {!shift && <Input label="Date" name="date" type="date" required />}
      <Select
        label="RA"
        explanation={
          shift
            ? `Select another RA to swap with ${shift.name}`
            : "Select an RA to serve this shift"
        }
        name="zoneId"
        options={raOptions}
        selected={shift?.zoneId}
        required
      />
    </Form>
  );
}
