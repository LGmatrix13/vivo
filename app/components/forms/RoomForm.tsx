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

/**
 * form to create/modify a room
 */
export default function RoomForm(props: RoomFormProps) {
  const { room, buildingsDropdown, rasDropdown } = props;
  const buildingOptions = buildingsDropdown.map((option) => {
    return {
      key: option.name,
      value: option.id,
    };
  });
  const raOptions = [
    {
      value: null,
      key: "Unassigned",
    },
    ...rasDropdown.map((option) => {
      return {
        key: option.name,
        value: option.id,
      };
    }),
  ];
  const roomTypeOptions = [
    {
      key: "Upper Campus",
      value: "UPPER_CAMPUS",
    },
    {
      key: "Colonial Quad",
      value: "COLONIAL_QUAD",
    },
    {
      key: "Colonial Triple",
      value: "COLONIAL_TRIPLE",
    },
    {
      key: "Colonial Double",
      value: "COLONIAL_DOUBLE",
    },
  ];
  return (
    <Form button="Save Room" intent={room ? "update" : "create"}>
      <h2 className="font-bold text-xl">
        {room ? `Edit Room ${room.roomNumber}` : "Add Room"}
      </h2>
      {room && <input type="hidden" name="id" value={room.id} />}
      <Select
        label="Building"
        name="buildingId"
        options={buildingOptions}
        selected={room?.buildingId}
        required
      />
      <Input
        label="Room Number"
        placeholder="Room Number"
        name="roomNumber"
        type="String"
        defaultValue={room?.roomNumber || undefined}
        required
      />
      <Select
        label="Room Type"
        name="roomType"
        options={roomTypeOptions}
        selected={room?.roomType}
        required
      />
      <Select
        label="RA"
        name="zoneId"
        options={raOptions}
        selected={room?.zoneId}
        required
      />
      <Input
        label="Capacity"
        placeholder="Capacity"
        name="capacity"
        type="number"
        defaultValue={room?.capacity || undefined}
        required
      />
    </Form>
  );
}
