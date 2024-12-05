import { IBuilding } from "~/models/building";
import Form from "../common/Form";
import Input from "../common/Input";

interface BuildingFormProps {
  building?: IBuilding;
}

export default function BuildingForm(props: BuildingFormProps) {
  const { building } = props;
  return (
    <Form toast="Saved Building" button="Save Building">
      <h2 className="font-bold text-xl">
        {building ? `Edit ${building.name}` : "Add Building"}
      </h2>
      <Input
        label="Name"
        name="name"
        type="text"
        value={building?.name}
        required
      />
      <Input label="Staff ID" name="staffId" type="number" required />
      <Input
        label="Latitude"
        name="latitude"
        type="number"
        value={building?.latitude}
        required
      />
      <Input
        label="Longitude"
        name="longitude"
        type="number"
        value={building?.longitude}
        required
      />
    </Form>
  );
}
