import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import AcknowledgeIssueRadio from "~/components/common/AcknowledgeIssueRadio";
import WideButton from "../common/WideButton";
import { colonialDoubleMapping } from "~/mappings/rci";

interface ColonialRCIDoubleFormProps {
  roomId: number;
  issues?: Record<string, string>;
}

export default function ColonialRCIDoubleForm(
  props: ColonialRCIDoubleFormProps
) {
  const { roomId, issues } = props;

  return (
    <Form className="space-y-5">
      <input name="roomId" type="hidden" value={roomId} />
      {Object.keys(colonialDoubleMapping).map((key) => (
        <AcknowledgeIssueRadio
          title={
            colonialDoubleMapping[key as keyof typeof colonialDoubleMapping]
          }
          yes={issues && !issues[key]}
        >
          <Textarea
            required
            label="Comments"
            name={key}
            placeholder={`Describe the issues with the ${
              colonialDoubleMapping[key as keyof typeof colonialDoubleMapping]
            }`}
            value={
              colonialDoubleMapping[key as keyof typeof colonialDoubleMapping]
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
