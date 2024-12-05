import Form from "../common/Form";

interface ARDFormProps {
  ard?: any;
}

export default function ARDForm(props: ARDFormProps) {
  const { ard } = props;
  return (
    <Form toast="Saved ARD" button="Save ARD">
      <h2 className="font-bold text-xl">
        {ard ? `Edit ${ard.fullName}` : "Add ARD"}
      </h2>
    </Form>
  );
}
