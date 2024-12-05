import { IBuilding } from "~/models/building";
import Form from "../common/Form";
import Input from "../common/Input";

interface BuildingFormProps {
  building?: IBuilding;
}

export default function BuildingForm(props: BuildingFormProps) {
  const { building } = props;
  return (
    <Form toast="Saved Building" button="Save Building" intent="create">
      <h2 className="font-bold text-xl">
        {building ? `Edit ${building.name}` : "Add Building"}
      </h2>
      <Input
        label="Name"
        placeholder="Name"
        name="name"
        type="text"
        value={building?.name}
        required
      />
      <Input
        label="Staff ID"
        placeholder="Staff ID"
        name="staffId"
        type="number"
        required
      />
      <Input
        label="Latitude"
        placeholder="Latitude"
        name="latitude"
        type="number"
        value={building?.latitude}
        required
      />
      <Input
        label="Longitude"
        placeholder="Longitude"
        name="longitude"
        type="number"
        value={building?.longitude}
        required
      />
    </Form>
  );
}
