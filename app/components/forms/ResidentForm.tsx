import { IResident } from "~/models/people";
import Form from "../common/Form";
import Input from "../common/Input";
import Select from "../common/Select";

interface ResidentFormProps {
  resident?: IResident;
}

export default function ResidentForm(props: ResidentFormProps) {
  const { resident } = props;
  return (
    <Form
      toast="Saved Resident"
      button="Save Resident"
      intent={resident ? "update" : "create"}
    >
      <h2 className="font-bold text-xl">
        {resident ? `Edit ${resident.fullName}` : "Add Resident"}
      </h2>
      {resident && <input type="hidden" name="id" value={resident.id} />}
      <Input
        label="First Name"
        placeholder="First Name"
        name="firstName"
        type="text"
        defaultValue={resident?.firstName}
        required
      />
      <Input
        label="Last Name"
        placeholder="Last Name"
        name="lastName"
        type="text"
        defaultValue={resident?.lastName}
        required
      />
      <Input
        label="Email Address"
        placeholder="Email Address"
        name="emailAddress"
        type="email"
        defaultValue={resident?.email}
        required
      />
      <Input
        label="City"
        placeholder="City"
        name="city"
        type="text"
        defaultValue={resident?.city}
        required
      />
      <Input
        label="Phone Number"
        placeholder="Phone Number"
        name="phoneNumber"
        type="tel"
        defaultValue={resident?.phone}
        required
      />
      <Input
        label="Mailbox"
        placeholder="Mailbox"
        name="mailbox"
        type="text"
        defaultValue={resident?.mailbox}
        required
      />
      <Input
        label="Class"
        placeholder="Class"
        name="class"
        type="text"
        defaultValue={resident?.class}
        required
      />
      <Select
        label="Gender"
        name="gender"
        defaultValue={resident?.gender}
        options={[
          {
            key: "Male",
            value: "MALE",
          },
          {
            key: "Female",
            value: "FEMALE",
          },
        ]}
        required
      />
      <Input
        label="Student ID"
        placeholder="Student ID"
        name="studentId"
        type="number"
        defaultValue={resident?.studentId}
        required
      />
    </Form>
  );
}
