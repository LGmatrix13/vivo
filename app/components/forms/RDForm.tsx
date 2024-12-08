import Form from "../common/Form";
import type { IRD } from "~/models/people";
import Input from "../common/Input";
import { IBuildingDropdown } from "~/models/housing";

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
    <Form toast="Saved RD" button="Save RD" intent={rd ? "update" : "create"}>
      <h2 className="font-bold text-xl">
        {rd ? `Edit ${rd.fullName}` : "Add RD"}
      </h2>
      {rd && <input name="id" type="hidden" value={rd?.id} />}
      <Input
        label="First Name"
        placeholder="First Name"
        name="firstName"
        type="text"
        defaultValue={rd?.firstName}
        required
      />
      <Input
        label="Last Name"
        placeholder="Last Name"
        name="lastName"
        type="text"
        defaultValue={rd?.lastName}
        required
      />
      <Input
        label="Email Address"
        placeholder="Email Address"
        name="emailAddress"
        type="email"
        defaultValue={rd?.emailAddress}
        required
      />
      <Input
        label="Mailbox"
        placeholder="Mailbox"
        name="mailbox"
        type="text"
        defaultValue={rd?.mailbox}
        required
      />
    </Form>
  );
}
