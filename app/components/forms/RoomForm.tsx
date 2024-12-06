import { IBuildingDropdown, IRoom } from "~/models/housing";
import Form from "../common/Form";
import Input from "../common/Input";
import Select from "../common/Select";
import { IRADropdown } from "~/models/people";

interface RoomFormProps {
  room?: IRoom;
  buildingsDropdown: IBuildingDropdown[];
  rasDropdown: IRADropdown[];
}

export default function RoomForm(props: RoomFormProps) {
  const { room, buildingsDropdown, rasDropdown } = props;
  const buildingOptions = buildingsDropdown.map((option) => {
    return {
      key: option.name,
      value: option.id,
    };
  });
  const raOptions = rasDropdown.map((option) => {
    return {
      key: option.name,
      value: option.id,
    };
  });
  return (
    <Form toast="Saved Room" button="Save Room" intent="create">
      <h2 className="font-bold text-xl">
        {room ? `Edit Room ${room.roomNumber}` : "Add Room"}
      </h2>
      <Select
        label="Building"
        name="buildingId"
        options={buildingOptions}
        required
      />
      <Select label="RA" name="buildingId" options={raOptions} required />
      <Input
        label="Room Number"
        placeholder="Room Number"
        name="roomNumber"
        type="number"
        value={room?.roomNumber}
        required
      />
      <Input
        label="Capacity"
        placeholder="Capacity"
        name="capacity"
        type="number"
        value={room?.capacity}
        required
      />
    </Form>
  );
}
