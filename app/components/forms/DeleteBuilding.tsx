import { Form, useSubmit } from "@remix-run/react";
import { useDrawerContext } from "../common/Drawer";
import { useToastContext } from "../common/Toast";
import { IBuilding } from "~/models/building";
import WideButton from "../common/WideButton";
import Input from "../common/Input";

interface DeleteBuildingProps {
  id: number;
}

// TODO: Finish form
export default function DeleteBuilding(props: DeleteBuildingProps) {
  const { id } = props;
  const [, setOpen] = useDrawerContext();
  const toast = useToastContext();
  const submit = useSubmit();

  return (
    <Form
      method="post"
      className="space-y-3"
      onSubmit={(event) => {
        setOpen(false);
        toast.success("Deleted Building");
        submit(event.currentTarget);
      }}
    >
      <h2 className="text-xl font-bold">Delete Building</h2>
      <p>Are you sure you want to delete this building?</p>
      <Input name="id" type="hidden" value={`${id}`} />
      <WideButton
        options={{
          type: "submit",
          name: "intent",
          value: "delete",
        }}
      >
        Confirm
      </WideButton>
    </Form>
  );
}
