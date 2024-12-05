import Form from "../common/Form";
import Input from "../common/Input";
import { IRoom } from "~/models/room";

interface RoomFormProps {
  room?: IRoom;
}

export default function RoomForm(props: RoomFormProps) {
  const { room } = props;
  return (
    <Form toast="Saved Room" button="Save Room" intent="create">
      <h2 className="font-bold text-xl">
        {room ? `Edit Room ${room.roomNumber}` : "Add Room"}
      </h2>
      <Input
        label="Building"
        placeholder="Building"
        name="buildingId"
        type="text"
        value={room?.building}
        required
      />
      <Input
        label="Zone"
        placeholder="Zone"
        name="zoneId"
        type="number"
        required
      />
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
