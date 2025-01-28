import AcknowledgeIssueRadio from "../common/AcknowledgeIssueRadio";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import { Form } from "@remix-run/react";
import WideButton from "../common/WideButton";
import { upperCampusMapping } from "~/mappings/rci";

interface UpperCampusRCIFormProps {
  roomId: number;
  issues?: Record<string, string>;
}

export default function UpperCampusRCIForm(props: UpperCampusRCIFormProps) {
  const { roomId, issues } = props;
  return (
    <Form className="space-y-5">
      <input name="roomId" type="hidden" value={roomId} />
      {Object.keys(upperCampusMapping).map((key) => (
        <AcknowledgeIssueRadio
          title={upperCampusMapping[key as keyof typeof upperCampusMapping]}
          yes={issues && !issues[key]}
        >
          <Textarea
            required
            label="Comments"
            name={key}
            placeholder={`Describe the issues with the ${
              upperCampusMapping[key as keyof typeof upperCampusMapping]
            }`}
            defaultValue={issues ? issues[key] : ""}
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
