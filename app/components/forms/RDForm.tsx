import Form from "../common/Form";
import type { IRD } from "~/models/people";
import Input from "../common/Input";
import { IBuildingDropdown } from "~/models/housing";
import Select from "../common/Select";
import MultipleSelect from "../common/MultipleSelect";

interface RDFormProps {
  rd?: IRD;
  buildingsDropdown: IBuildingDropdown[];
}

export default function RDForm(props: RDFormProps) {
  const { rd, buildingsDropdown } = props;
  const buildingOptions = buildingsDropdown.map((option) => {
    return {
      key: option.name,
      value: option.id,
    };
  });
  return (
    <Form toast="Saved RD" button="Save RD" intent="create">
      <h2 className="font-bold text-xl">
        {rd ? `Edit ${rd.fullName}` : "Add RD"}
      </h2>
      <Input
        label="First Name"
        placeholder="First Name"
        name="firstName"
        type="text"
        value={rd?.firstName}
        required
      />
      <Input
        label="Last Name"
        placeholder="Last Name"
        name="lastName"
        type="text"
        value={rd?.lastName}
        required
      />
      <Input
        label="Email Address"
        placeholder="Email Address"
        name="emailAddress"
        type="email"
        value={rd?.email}
        required
      />
      <Input
        label="Mailbox"
        placeholder="Mailbox"
        name="mailbox"
        type="text"
        value={rd?.mailbox}
        required
      />
      <MultipleSelect
        label="Buildings"
        name="buildingIds"
        options={buildingOptions}
        required
      />
    </Form>
  );
}
