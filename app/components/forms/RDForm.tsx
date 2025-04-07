import Form from "../common/Form";
import type { IRD } from "~/models/people";
import Input from "../common/Input";
import Select from "../common/Select";

interface RDFormProps {
  rd?: IRD;
}

/**
 * form to create/modify an RD
 */
export default function RDForm(props: RDFormProps) {
  const { rd } = props;
  const genderOptions = [
    {
      key: "Male",
      value: "MALE",
    },
    {
      key: "Female",
      value: "FEMALE",
    },
  ];

  return (
    <Form button="Save RD" intent={rd ? "update" : "create"}>
      <h2 className="font-bold text-xl">
        {rd ? `Edit ${rd.fullName}` : "Add RD"}
      </h2>
      {rd && <input name="id" type="hidden" value={rd.id} />}
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
      <Select
        label="Gender"
        placeholder="Gender"
        name="gender"
        selected={rd?.gender}
        options={genderOptions}
        required
      />
    </Form>
  );
}
