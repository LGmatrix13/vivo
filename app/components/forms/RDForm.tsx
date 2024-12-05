import Form from "../common/Form";
import type { IRD } from "~/models/people";

interface RDFormProps {
  rd?: IRD;
}

export default function RDForm(props: RDFormProps) {
  const { rd } = props;
  return (
    <Form toast="Saved RD" button="Save RD" intent="create">
      <h2 className="font-bold text-xl">
        {rd ? `Edit ${rd.fullName}` : "Add RD"}
      </h2>
    </Form>
  );
}
