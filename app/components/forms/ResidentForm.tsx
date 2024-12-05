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
    <Form toast="Saved Resident" button="Save Resident" intent="create">
      <h2 className="font-bold text-xl">
        {resident ? `Edit ${resident.fullName}` : "Add Resident"}
      </h2>
      <Input
        label="First Name"
        placeholder="First Name"
        name="firstName"
        type="text"
        value={resident?.firstName}
        required
      />
      <Input
        label="Last Name"
        placeholder="Last Name"
        name="lastName"
        type="text"
        value={resident?.lastName}
        required
      />
      <Input
        label="Email Address"
        placeholder="Email Address"
        name="emailAddress"
        type="email"
        value={resident?.email}
        required
      />
      <Input
        label="City"
        placeholder="City"
        name="city"
        type="text"
        value={resident?.city}
        required
      />
      <Input
        label="Phone Number"
        placeholder="Phone Number"
        name="phoneNumber"
        type="tel"
        value={resident?.phone}
        required
      />
      <Input
        label="Mailbox"
        placeholder="Mailbox"
        name="mailbox"
        type="text"
        value={resident?.mailbox}
        required
      />
      <Input
        label="Class"
        placeholder="Class"
        name="class"
        type="text"
        value={resident?.class}
        required
      />
      <Select
        label="Gender"
        name="gender"
        value={resident?.gender}
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
      />
      <Input
        label="Student ID"
        placeholder="Student ID"
        name="studentId"
        type="number"
        value={resident?.studentId}
        required
      />
    </Form>
  );
}
