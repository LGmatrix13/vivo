import Form from "../common/Form";

interface ResidentFormProps {
  resident?: any;
}

export default function ResidentForm(props: ResidentFormProps) {
  const { resident } = props;
  return (
    <Form toast="Saved Resident" button="Save Resident">
      <h2 className="font-bold text-xl">
        {resident ? `Edit ${resident.fullName}` : "Add Resident"}
      </h2>
    </Form>
  );
}
