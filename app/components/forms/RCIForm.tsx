import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import AcknowledgeIssueRadio from "../common/AcknowledgeIssueRadio";
import WideButton from "../common/WideButton";
import { ISubmittedRCI } from "~/models/rci";

interface RCIFormProps {
  intent: string;
  mapping: Record<string, string>;
  submittedRCI?: ISubmittedRCI;
}

export default function RCIForm(props: RCIFormProps) {
  const { submittedRCI, mapping, intent } = props;

  return (
    <Form className="space-y-5" method="post">
      {submittedRCI?.id && (
        <input name="id" type="hidden" value={submittedRCI.id} />
      )}
      <input
        name="roomId"
        type="hidden"
        value={submittedRCI?.roomId as number}
      />
      {Object.keys(mapping).map((key) => (
        <AcknowledgeIssueRadio
          title={mapping[key as keyof typeof mapping]}
          yes={submittedRCI?.issues && !!submittedRCI.issues[key]}
        >
          <Textarea
            required
            label="Comments"
            name={key}
            placeholder={`Describe the issues with the ${mapping[key]}`}
            defaultValue={submittedRCI?.issues ? submittedRCI?.issues[key] : ""}
          />
        </AcknowledgeIssueRadio>
      ))}
      <div className="space-x-2 flex items-center">
        <input type="checkbox" name="roomKeyRecieved" required />
        <label htmlFor="roomKeyRecieved">Recieved Room Key</label>
      </div>
      <Input
        label="Student Signature"
        placeholder="Signature"
        name="studentSignature"
        type="text"
        required
      />
      <WideButton
        options={{
          type: "submit",
          name: "intent",
          value: intent,
        }}
      >
        Save Check-in Form
      </WideButton>
    </Form>
  );
}
