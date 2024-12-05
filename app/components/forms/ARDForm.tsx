import { IARD } from "~/models/people";
import Form from "../common/Form";

interface ARDFormProps {
  ard?: IARD;
}

export default function ARDForm(props: ARDFormProps) {
  const { ard } = props;
  return (
    <Form toast="Saved ARD" button="Save ARD" intent="create">
      <h2 className="font-bold text-xl">
        {ard ? `Edit ${ard.fullName}` : "Add ARD"}
      </h2>
    </Form>
  );
}
