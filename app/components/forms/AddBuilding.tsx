import { Form } from "@remix-run/react";
import Input from "../common/Input";
import WideButton from "../common/WideButton";

// TODO: Finish form
export default function AddBuilding() {
  // TODO: Use select instead of an input for staff id
  return (
    <Form method="post" className="space-y-5">
      <h2 className="text-xl font-bold">Add a Building</h2>
      <Input label="Name" name="name" type="text" required />
      <Input label="Staff ID" name="staffID" type="number" required />
      <Input label="Latitude" name="latitude" type="number" required />
      <Input label="Longitude" name="longitude" type="number" required />
      <WideButton>Save Building</WideButton>
    </Form>
  );
}
