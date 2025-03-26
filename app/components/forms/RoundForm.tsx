import { IRoundReport } from "~/models/reports";
import Form from "../common/Form";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

interface ConversationFormProps {
  zoneId: number;
  round?: IRoundReport;
  action?:string;
}

export default function RoundForm(props: ConversationFormProps) {
  const { round, zoneId, action } = props;

  return (
    <Form button="Save Round Report" intent={round ? "update" : "create"} action={action}>
      <h2 className="font-bold text-xl">
        {round ? "Edit Round" : "Add Round"}
      </h2>
      {round && <input name="id" type="hidden" value={round.id} />}
      <input name="zoneId" type="hidden" value={zoneId} />
      {!round && (
        <Input
          label="Time"
          placeholder="Time"
          name="time"
          type="datetime-local"
          required
        />
      )}
      <Textarea
        label="Round Description"
        name="description"
        defaultValue={round?.description}
        required
      />
      <Textarea
        name="violations"
        label="Violations"
        defaultValue={round?.violations || ""}
      />
      <Textarea
        label="Outstanding Work Orders"
        name="outstandingWorkOrders"
        defaultValue={round?.outstandingWorkOrders || ""}
      />
    </Form>
  );
}
