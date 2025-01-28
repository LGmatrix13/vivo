import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import AcknowledgeIssueRadio from "../common/AcknowledgeIssueRadio";
import WideButton from "../common/WideButton";
import { colonialQuadMapping } from "~/mappings/rci";

interface ColonialRCIQuadFormProps {
  roomId: number;
  issues?: Record<string, string>;
}

export default function RCIForm(props: ColonialRCIQuadFormProps) {
  const { roomId, issues } = props;

  return (
    <Form className="space-y-5">
      <input name="roomId" type="hidden" value={roomId} />
      {Object.keys(colonialQuadMapping).map((key) => (
        <AcknowledgeIssueRadio
          title={colonialQuadMapping[key as keyof typeof colonialQuadMapping]}
          yes={issues && !issues[key]}
        >
          <Textarea
            required
            label="Comments"
            name={key}
            placeholder={`Describe the issues with the ${
              colonialQuadMapping[key as keyof typeof colonialQuadMapping]
            }`}
            defaultValue={
              colonialQuadMapping[key as keyof typeof colonialQuadMapping]
            }
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
