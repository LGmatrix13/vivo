import { IRoundReport } from "~/models/reports";
import Form from "../common/Form";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

interface ConversationFormProps {
  zoneId: number;
  round?: IRoundReport;
}

export default function RoundForm(props: ConversationFormProps) {
  const { round, zoneId } = props;

  return (
    <Form button="Save Round Report" intent={round ? "supdate" : "create"}>
      <h2 className="font-bold text-xl">
        {round ? "Edit Round" : "Add Round"}
      </h2>
      {round && <input name="ids" type="hidden" value={round.id} />}
      <input name="zoneId" type="hidden" value={zoneId} />
      <Input
        label="Time"
        placeholder="Time"
        name="time"
        type="datetime-local"
        required
      />
      <Textarea
        label="Round Description"
        name="description"
        defaultValue={round?.description}
        required
      />
      <Textarea
        name="violations"
        label="Violations"
        defaultValue={round?.violation || ""}
      />
      <Textarea
        label="Outstanding Work Orders"
        name="outstandingWorkOrders"
        defaultValue={round?.facilityConcerns || ""}
      />
    </Form>
  );
}
