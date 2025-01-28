import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import AcknowledgeIssueRadio from "../common/AcknowledgeIssueRadio";
import WideButton from "../common/WideButton";

interface RCIFormProps {
  mapping: Record<string, string>;
  roomId: number;
  issues?: Record<string, string>;
}

export default function RCIForm(props: RCIFormProps) {
  const { roomId, issues, mapping } = props;

  return (
    <Form className="space-y-5">
      <input name="roomId" type="hidden" value={roomId} />
      {Object.keys(mapping).map((key) => (
        <AcknowledgeIssueRadio
          title={mapping[key as keyof typeof mapping]}
          yes={issues && !issues[key]}
        >
          <Textarea
            required
            label="Comments"
            name={key}
            placeholder={`Describe the issues with the ${mapping[key]}`}
            defaultValue={mapping[key]}
          />
        </AcknowledgeIssueRadio>
      ))}
      <Input
        label="Student Signature"
        placeholder="Signature"
        name="signature"
        type="text"
        required
      />
      <WideButton
        options={{
          type: "submit",
          intent: "create.colonialDouble",
        }}
      >
        Save Check-in Form
      </WideButton>
    </Form>
  );
}
