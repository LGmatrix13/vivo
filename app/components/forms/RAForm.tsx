import Form from "../common/Form";
import { IRA } from "~/models/ra";

interface RAFormProps {
  ra?: IRA;
}

export default function RAForm(props: RAFormProps) {
  const { ra } = props;
  return (
    <Form toast="Saved RA" button="Save RA">
      <h2 className="font-bold text-xl">
        {ra ? `Edit ${ra.fullName}` : "Add RA"}
      </h2>
    </Form>
  );
}
