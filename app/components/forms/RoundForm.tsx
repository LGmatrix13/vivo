import { IRoundReport } from "~/models/reports";
import Form from "../common/Form";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

interface RoundFormProps {
  zoneId: number;
  round?: IRoundReport;
}

export default function RoundForm(props: RoundFormProps) {
  const { round, zoneId } = props;

  return (
    <Form button="Save Round Report" intent={round ? "update" : "create"}>
      <h2 className="text-xl font-bold">
        {round ? "Edit Round" : "Add Round"}
      </h2>
      {round && <input name="id" type="hidden" value={round.id} />}
      <input name="zoneId" type="hidden" value={zoneId} />
      {!round && (
        <Input label="Time" name="time" type="datetime-local" required />
      )}
      <Textarea
        label="Round Description"
        name="description"
        defaultValue={round?.description}
        placeholder="Description"
        required
      />
    </Form>
  );
}
