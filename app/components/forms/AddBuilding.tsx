import { Form, useSubmit } from "@remix-run/react";
import Input from "../common/Input";
import WideButton from "../common/WideButton";
import { useDrawerContext } from "../common/Drawer";
import { useToastContext } from "../common/Toast";

// TODO: Finish form
export default function AddBuilding() {
  // TODO: Use select instead of an input for staff id
  const [, setOpen] = useDrawerContext();
  const toast = useToastContext();
  const submit = useSubmit();
  return (
    <Form
      method="post"
      className="space-y-5"
      onSubmit={(event) => {
        setOpen(false);
        toast.success("Building Added");
        submit(event.currentTarget);
      }}
    >
      <h2 className="text-xl font-bold">Add a Building</h2>
      <Input label="Name" name="name" type="text" required />
      <Input label="Staff ID" name="staffId" type="number" required />
      <Input label="Latitude" name="latitude" type="number" required />
      <Input label="Longitude" name="longitude" type="number" required />
      <WideButton
        options={{
          type: "submit",
          name: "intent",
          value: "create",
        }}
      >
        Save Building
      </WideButton>
    </Form>
  );
}
