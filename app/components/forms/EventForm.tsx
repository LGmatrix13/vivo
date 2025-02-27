import { IEventReport } from "~/models/reports";
import Form from "../common/Form";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

interface EventFormProps {
  zoneId: number;
  event?: IEventReport;
}

export default function EventForm(props: EventFormProps) {
  const { event, zoneId } = props;
  return (
    <Form button="Save Event" intent={event ? "update" : "create"}>
      <h2 className="font-bold text-xl">
        {event ? "Edit Event" : "Add Event"}
      </h2>
      {event && <input name="id" type="hidden" value={event.id} />}
      <input name="zoneId" type="hidden" value={zoneId} />
      {!event && (
        <Input
          label="Time"
          placeholder="Time"
          name="time"
          type="datetime-local"
          required
        />
      )}
      <Input
        label="Attendance"
        placeholder="Attendance"
        name="attendance"
        type="number"
        defaultValue={event?.attendance}
        required
        min = "0"
      />
      <Textarea
        label="Description"
        name="description"
        defaultValue={event?.description}
        required
      />
    </Form>
  );
}
